import { useState, useMemo, useEffect, useRef, type ReactElement } from 'react'
import {
  AkButton,
  AkCard,
  AkCardHeader,
  AkCardTitle,
  AkCardDescription,
  AkCardContent,
  AkTable,
  AkStatus,
  AkProgress,
  AkGauge,
  AkDialog,
  AkSegmented,
  AkChoice,
  AkField,
  AkFieldLabel,
  AkInput,
  AkInputNumber,
  AkPagination,
  AkNotice,
  AkNoticeStack,
  AkBilingual,
  AkDisplay,
  AkCountUp,
  AkOverline,
  AkTag,
  AkSlider,
  playTactileSound,
} from '../ak'
import { useI18n } from './i18n'

export type ScenarioId = 'cluster' | 'pipeline' | 'audit' | 'warroom'

// ── 场景 01 数据结构：分布式集群与节点遥测 ─────────────────────────────

interface ClusterNode {
  id: string
  name: string
  role: string
  ip: string
  status: 'nominal' | 'warning' | 'critical'
  statusLabel: string
  cpu: number
  mem: number
  uptime: string
}

const CLUSTER_NODES: ClusterNode[] = [
  {
    id: 'node-alpha-01',
    name: 'NODE-ALPHA-01',
    role: 'KUBE-MASTER / CONTROL PLANE',
    ip: '10.240.0.12',
    status: 'nominal',
    statusLabel: 'ONLINE // HEALTHY',
    cpu: 42,
    mem: 38,
    uptime: '48d 14h',
  },
  {
    id: 'node-beta-02',
    name: 'NODE-BETA-02',
    role: 'WORKER-GPU / INFERENCE RUNTIME',
    ip: '10.240.0.18',
    status: 'warning',
    statusLabel: 'HIGH LOAD // HEAVY IO',
    cpu: 89,
    mem: 84,
    uptime: '12d 06h',
  },
  {
    id: 'node-gamma-03',
    name: 'NODE-GAMMA-03',
    role: 'EDGE-GATEWAY / TRAFFIC INGRESS',
    ip: '10.240.1.4',
    status: 'nominal',
    statusLabel: 'ONLINE // ROUTING',
    cpu: 28,
    mem: 22,
    uptime: '94d 21h',
  },
  {
    id: 'node-delta-04',
    name: 'NODE-DELTA-04',
    role: 'STORAGE-RELAY / DISTRIBUTED DB',
    ip: '10.240.2.9',
    status: 'nominal',
    statusLabel: 'SYNCING // RAID-10',
    cpu: 58,
    mem: 62,
    uptime: '31d 09h',
  },
]

interface ProcessRow {
  pid: string
  process: string
  cpu: number
  mem: string
  status: string
}

const INITIAL_PROCESSES: Record<string, ProcessRow[]> = {
  'node-alpha-01': [
    { pid: '1042', process: 'kube-apiserver --etcd-servers', cpu: 14.8, mem: '2.1 GB', status: 'RUNNING' },
    { pid: '1098', process: 'etcd --wal-dir=/data/etcd', cpu: 11.2, mem: '1.4 GB', status: 'RUNNING' },
    { pid: '2041', process: 'kube-controller-manager', cpu: 8.4, mem: '840 MB', status: 'RUNNING' },
    { pid: '3180', process: 'coredns -conf /etc/coredns', cpu: 2.1, mem: '256 MB', status: 'IDLE' },
  ],
  'node-beta-02': [
    { pid: '8491', process: 'vllm-inference-engine --gpu 0', cpu: 48.6, mem: '32.4 GB', status: 'RUNNING' },
    { pid: '8492', process: 'triton-model-server --grpc', cpu: 31.2, mem: '18.1 GB', status: 'RUNNING' },
    { pid: '9012', process: 'cuda-mps-server', cpu: 6.8, mem: '2.8 GB', status: 'RUNNING' },
    { pid: '9920', process: 'nvidia-dcgm-exporter', cpu: 2.4, mem: '512 MB', status: 'IDLE' },
  ],
  'node-gamma-03': [
    { pid: '4102', process: 'envoy-ingress-proxy --workers 8', cpu: 16.4, mem: '1.8 GB', status: 'RUNNING' },
    { pid: '4108', process: 'waf-security-shield --rules=active', cpu: 7.2, mem: '920 MB', status: 'RUNNING' },
    { pid: '5201', process: 'tls-termination-daemon', cpu: 3.8, mem: '380 MB', status: 'RUNNING' },
  ],
  'node-delta-04': [
    { pid: '6104', process: 'cockroachdb-storage-engine', cpu: 32.5, mem: '14.2 GB', status: 'RUNNING' },
    { pid: '6189', process: 'wal-replication-stream', cpu: 18.2, mem: '6.4 GB', status: 'SYNC' },
    { pid: '7021', process: 's3-backup-snapshot-worker', cpu: 7.3, mem: '1.1 GB', status: 'IDLE' },
  ],
}

// ── 场景 03 数据结构：安全审计 ─────────────────────────────────────────

interface AuditEvent {
  id: string
  time: string
  operator: string
  ip: string
  action: string
  severity: 'info' | 'warning' | 'danger'
}

const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  { id: 'aud-901', time: '13:14:22', operator: 'OPS-LEAD // KALTSIT', ip: '10.240.0.4', action: 'APPLY CLUSTER SECURITY POLICY // TLS-1.3 ENFORCED', severity: 'info' },
  { id: 'aud-902', time: '13:12:08', operator: 'AUTOMATION // PRTS-DAEMON', ip: '10.240.0.1', action: 'AUTOSCALE TRIGGERED // +4 PODS IN WORKER-BETA', severity: 'info' },
  { id: 'aud-903', time: '13:08:44', operator: 'EXT-PROXY // 198.51.100.24', ip: '198.51.100.24', action: 'ANOMALOUS TCP BURST BLOCKED // WAF SHIELDED', severity: 'danger' },
  { id: 'aud-904', time: '12:59:15', operator: 'SYS-ADMIN // DOC-01', ip: '10.240.0.8', action: 'CONTAINER IMAGE DEPLOYED // SHA: 8F4E2B19', severity: 'info' },
  { id: 'aud-905', time: '12:45:30', operator: 'SECURITY-AGENT', ip: '10.240.1.15', action: 'CERTIFICATE ROTATION SCHEDULED // EXPIRING 7D', severity: 'warning' },
  { id: 'aud-906', time: '12:30:11', operator: 'AUDIT-CHECKER', ip: '10.240.0.1', action: 'ZERO TRUST MTLS VERIFICATION SUCCESS', severity: 'info' },
]

// ── 场景 04 数据结构：故障应急作战室与服务网格 ─────────────────────────

interface MeshService {
  id: string
  name: string
  role: string
  status: 'healthy' | 'degraded' | 'critical'
  latency: number
  p99: number
  errorRate: number
  trafficRate: number
  circuitBreaker: 'closed' | 'open' | 'half-open'
}

const INITIAL_MESH_SERVICES: MeshService[] = [
  {
    id: 'api-gateway',
    name: 'EDGE // ENVOY-GATEWAY',
    role: 'L7 INGRESS & RATE LIMIT',
    status: 'healthy',
    latency: 12,
    p99: 28,
    errorRate: 0.02,
    trafficRate: 46.2,
    circuitBreaker: 'closed',
  },
  {
    id: 'auth-service',
    name: 'AUTH // OAUTH2-TOKEN-SVC',
    role: 'JWT VERIFY & MTLS IDENTITY',
    status: 'healthy',
    latency: 8,
    p99: 19,
    errorRate: 0.0,
    trafficRate: 21.8,
    circuitBreaker: 'closed',
  },
  {
    id: 'checkout-api',
    name: 'CORE // CHECKOUT-TRANSACTION',
    role: 'ORDER & PAYMENT ORCHESTRATION',
    status: 'degraded',
    latency: 540,
    p99: 1820,
    errorRate: 14.8,
    trafficRate: 14.5,
    circuitBreaker: 'half-open',
  },
  {
    id: 'payment-gw',
    name: 'RELAY // STRIPE-PAYMENT-ADAPTER',
    role: 'EXTERNAL GATEWAY CONNECTOR',
    status: 'healthy',
    latency: 94,
    p99: 210,
    errorRate: 0.15,
    trafficRate: 9.2,
    circuitBreaker: 'closed',
  },
]

export interface TacticalScenariosViewProps {
  onBrowseCatalogue?: () => void
}

export function TacticalScenariosView({ onBrowseCatalogue }: TacticalScenariosViewProps = {}): ReactElement {
  const { locale } = useI18n()
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('cluster')
  const [showCode, setShowCode] = useState(false)

  // ── 场景 01 状态：集群遥测 ──────────────────────────────────────────
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-alpha-01')
  const [drainDialogOpen, setDrainDialogOpen] = useState(false)
  const [drainedNodeIds, setDrainedNodeIds] = useState<string[]>([])
  const [clusterNotice, setClusterNotice] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<'pid' | 'process' | 'cpu'>('cpu')
  const [sortDir, setSortDir] = useState<'ascending' | 'descending' | 'none'>('descending')
  const [procSearch, setProcSearch] = useState('')
  const [processMap, setProcessMap] = useState<Record<string, ProcessRow[]>>(INITIAL_PROCESSES)
  const [livePulse, setLivePulse] = useState(true)
  const [cpuJitter, setCpuJitter] = useState(0)
  const [liveTicker, setLiveTicker] = useState('HEARTBEAT 13:50:00 · node-alpha-01 sync: 0 errors · WAN ingress nominal')

  // 场景 01 周期心跳仿真
  useEffect(() => {
    if (!livePulse) return
    const timer = setInterval(() => {
      const delta = (Math.random() - 0.5) * 3
      setCpuJitter(Number(delta.toFixed(1)))
      const now = new Date().toLocaleTimeString()
      const bw = (4.6 + Math.random() * 0.4).toFixed(2)
      setLiveTicker(`[HEARTBEAT ${now}] node-alpha-01: kubelet sync 0 errors · net_rx: ${bw} GB/s · WAN nominal`)
    }, 3200)
    return () => clearInterval(timer)
  }, [livePulse])

  // ── 场景 02 状态：流水线编排 ─────────────────────────────────────────
  const [pipelineStep, setPipelineStep] = useState<number>(2) // 0: Quality, 1: Build, 2: Scan, 3: Deploy
  const [pipelineConcurrency, setPipelineConcurrency] = useState<number>(8)
  const [autoRollback, setAutoRollback] = useState<boolean>(true)
  const [twoFactorEnforce, setTwoFactorEnforce] = useState<boolean>(true)
  const [rollbackDialogOpen, setRollbackDialogOpen] = useState<boolean>(false)
  const [pipelineNotice, setPipelineNotice] = useState<string | null>(null)
  const [isAutoRunning, setIsAutoRunning] = useState(false)
  const [autoRunProgress, setAutoRunProgress] = useState(65)
  const autoRunTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 自动流水线演练调度器
  const handleStartAutoRun = () => {
    if (isAutoRunning) return
    playTactileSound('confirm', 0.2)
    setIsAutoRunning(true)
    setPipelineStep(0)
    setAutoRunProgress(15)
    setPipelineNotice('[PIPELINE STARTED] Executing Stage 01: Static AST Analysis & Unit Tests...')

    autoRunTimerRef.current = setTimeout(() => {
      setPipelineStep(1)
      setAutoRunProgress(45)
      setPipelineNotice('[STAGE 01 PASSED] Executing Stage 02: Multi-arch OCI Container Compilation...')

      autoRunTimerRef.current = setTimeout(() => {
        setPipelineStep(2)
        setAutoRunProgress(75)
        setPipelineNotice('[STAGE 02 PASSED] Executing Stage 03: Trivy SBOM & Zero-Day CVE Vulnerability Scan...')

        autoRunTimerRef.current = setTimeout(() => {
          setPipelineStep(3)
          setAutoRunProgress(100)
          setIsAutoRunning(false)
          playTactileSound('confirm', 0.25)
          setPipelineNotice('[PIPELINE COMPLETED] Stage 04 Canary deployment reached 100% quorum!')
        }, 1600)
      }, 1600)
    }, 1600)
  }

  const handleAbortPipeline = () => {
    if (autoRunTimerRef.current) clearTimeout(autoRunTimerRef.current)
    setIsAutoRunning(false)
    playTactileSound('warn', 0.25)
    setPipelineNotice('[PIPELINE ABORTED] Emergency circuit break engaged. Reverted to previous stable SHA.')
    setRollbackDialogOpen(false)
  }

  // ── 场景 03 状态：安全审计 ───────────────────────────────────────────
  const [auditList, setAuditList] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS)
  const [auditFilter, setAuditFilter] = useState<'all' | 'info' | 'warning' | 'danger'>('all')
  const [auditSearch, setAuditSearch] = useState<string>('')
  const [mfaSwitch, setMfaSwitch] = useState<boolean>(true)
  const [ipWhitelistSwitch, setIpWhitelistSwitch] = useState<boolean>(true)
  const [inspectAudit, setInspectAudit] = useState<AuditEvent | null>(null)
  const [blockedIps, setBlockedIps] = useState<string[]>([])
  const [auditNotice, setAuditNotice] = useState<string | null>(null)

  // 模拟注入威胁事件
  const handleSimulateThreat = () => {
    playTactileSound('warn', 0.25)
    const threat: AuditEvent = {
      id: `threat-${Math.random().toString(36).slice(2, 6)}`,
      time: new Date().toLocaleTimeString(),
      operator: 'SUSPECT-BOT // PROBE-09',
      ip: '203.0.113.88',
      action: 'UNAUTHORIZED PRIVILEGE ESCALATION ATTEMPT ON /v2/iam/tokens',
      severity: 'danger',
    }
    setAuditList((prev) => [threat, ...prev])
    setInspectAudit(threat)
    setAuditNotice('[INTRUSION ALERT] High-risk privilege anomaly detected from IP 203.0.113.88!')
  }

  const handleExportAudits = () => {
    playTactileSound('confirm', 0.2)
    const json = JSON.stringify(filteredAudits, null, 2)
    navigator.clipboard.writeText(json)
    setAuditNotice(`[EXPORT SUCCESS] ${filteredAudits.length} audit records copied to clipboard as JSON!`)
    setTimeout(() => setAuditNotice(null), 3500)
  }

  // ── 场景 04 状态：故障应急作战室 ─────────────────────────────────────
  const [meshServices, setMeshServices] = useState<MeshService[]>(INITIAL_MESH_SERVICES)
  const [incidentStatus, setIncidentStatus] = useState<'active' | 'mitigated' | 'resolved'>('active')
  const [pageDialogOpen, setPageDialogOpen] = useState(false)
  const [trafficRatio, setTrafficRatio] = useState(20) // US-East standby ratio (0 - 100%)
  const [warroomNotice, setWarroomNotice] = useState<string | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState('checkout-api')

  const selectedMeshService = meshServices.find((s) => s.id === selectedServiceId) ?? meshServices[2]
  const isCheckoutTripped = meshServices.find((s) => s.id === 'checkout-api')?.circuitBreaker === 'open'

  const toggleCircuitBreaker = () => {
    playTactileSound('dial', 0.2)
    setMeshServices((prev) =>
      prev.map((s) => {
        if (s.id !== 'checkout-api') return s
        const nextBreaker = s.circuitBreaker === 'open' ? 'half-open' : 'open'
        return {
          ...s,
          circuitBreaker: nextBreaker,
          errorRate: nextBreaker === 'open' ? 0.08 : 14.8,
          latency: nextBreaker === 'open' ? 42 : 540,
          status: nextBreaker === 'open' ? 'healthy' : 'degraded',
        }
      }),
    )
    if (!isCheckoutTripped) {
      setWarroomNotice('[CIRCUIT BREAKER OPEN] checkout-api isolated! Mock fallback engaged; customer error rate fell to 0.08%.')
    } else {
      setWarroomNotice('[CIRCUIT BREAKER RESET] checkout-api returned to half-open canary inspection.')
    }
    setTimeout(() => setWarroomNotice(null), 4000)
  }

  const handleResolveIncident = () => {
    playTactileSound('confirm', 0.25)
    if (incidentStatus === 'resolved') {
      setIncidentStatus('active')
      setWarroomNotice('[INCIDENT REOPENED] Alert re-escalated to SRE Tier-1 rotation.')
    } else {
      setIncidentStatus('resolved')
      setMeshServices((prev) =>
        prev.map((s) => ({
          ...s,
          status: 'healthy',
          errorRate: 0.01,
          latency: 24,
          circuitBreaker: 'closed',
        })),
      )
      setWarroomNotice('[INCIDENT RESOLVED] All services verified healthy. Post-mortem draft dispatched to Commander.')
    }
  }

  // ── 场景 01 计算派生数据 ─────────────────────────────────────────────
  const selectedNode = CLUSTER_NODES.find((n) => n.id === selectedNodeId) ?? CLUSTER_NODES[0]
  const currentProcesses = processMap[selectedNode.id] ?? []

  const sortedProcesses = useMemo(() => {
    let list = [...currentProcesses]
    if (procSearch.trim()) {
      const q = procSearch.toLowerCase()
      list = list.filter((p) => p.process.toLowerCase().includes(q) || p.pid.includes(q))
    }
    if (sortDir === 'none') return list
    return list.sort((a, b) => {
      const valA = a[sortKey]
      const valB = b[sortKey]
      const diff = typeof valA === 'number' && typeof valB === 'number'
        ? valA - valB
        : String(valA).localeCompare(String(valB))
      return sortDir === 'ascending' ? diff : -diff
    })
  }, [currentProcesses, sortKey, sortDir, procSearch])

  // ── 场景 03 计算派生数据 ─────────────────────────────────────────────
  const filteredAudits = useMemo(() => {
    return auditList.filter((ev) => {
      if (auditFilter !== 'all' && ev.severity !== auditFilter) return false
      if (auditSearch.trim()) {
        const q = auditSearch.toLowerCase()
        return ev.action.toLowerCase().includes(q) || ev.operator.toLowerCase().includes(q) || ev.ip.includes(q)
      }
      return true
    })
  }, [auditList, auditFilter, auditSearch])

  const handleSortChange = (key: 'pid' | 'process' | 'cpu') => {
    playTactileSound('dial', 0.15)
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir('descending')
    } else if (sortDir === 'descending') {
      setSortDir('ascending')
    } else if (sortDir === 'ascending') {
      setSortDir('none')
    } else {
      setSortDir('descending')
    }
  }

  return (
    <div className="demo-scenarios-view">
      {/* 场景顶栏与导航 */}
      <section className="demo-scenarios__hero">
        <div className="demo-scenarios__hero-left">
          <span className="demo-hero__badge">
            <span className="demo-hero__badge-dot" />
            TACTICAL COMPOSABLE SCENARIOS // 真实高密度工业界面模版
          </span>
          <h1 className="demo-scenarios__title">
            <span className="demo-scenarios__title-en">INDUSTRIAL INTERFACE BENCHMARK</span>
            <span className="demo-scenarios__title-cn">
              {locale === 'zh-CN' ? '全要素复合战术工程模板' : 'Production Scenarios & Architecture'}
            </span>
          </h1>
          <p className="demo-scenarios__desc">
            {locale === 'zh-CN'
              ? '摆脱无上下文的扁平孤立控件罗列。以下模板由 @swufefox/ak-ui-react 基础组件高密度深度协同打造，具备完整真实状态机、可交互数据排序与生产级代码结构。'
              : 'Beyond isolated component listings. These operational stations demonstrate real-world composition with stateful telemetry, sortable datasets, and responsive industrial design.'}
          </p>
        </div>

        <div className="demo-scenarios__switcher">
          <AkSegmented
            size="md"
            ariaLabel="Scenario Select"
            options={[
              { label: '01 // CLUSTER TELEMETRY (集群遥测)', value: 'cluster' },
              { label: '02 // PIPELINE DISPATCH (任务编排)', value: 'pipeline' },
              { label: '03 // SECURITY AUDIT (安全审计)', value: 'audit' },
              { label: '04 // INCIDENT WAR ROOM (应急作战室)', value: 'warroom' },
            ]}
            value={activeScenario}
            onValueChange={(val) => {
              playTactileSound('tab', 0.16)
              setActiveScenario((val as ScenarioId) || 'cluster')
            }}
          />

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <AkButton
              variant={showCode ? 'action' : 'outline'}
              chamfer
              size="sm"
              onClick={() => {
                playTactileSound('click', 0.15)
                setShowCode((prev) => !prev)
              }}
              iconEnd={<span>{showCode ? '▲' : '▼'}</span>}
            >
              {showCode ? 'HIDE TSX CODE // 收起代码' : 'VIEW TSX CODE // 查看源码'}
            </AkButton>

            {onBrowseCatalogue && (
              <AkButton
                variant="outline"
                size="sm"
                onClick={() => {
                  playTactileSound('tab', 0.16)
                  onBrowseCatalogue()
                }}
                iconEnd={<span>→</span>}
              >
                {locale === 'zh-CN' ? '查看 17 组底层原子控件索引' : 'View 17 Component Catalogues'}
              </AkButton>
            )}
          </div>
        </div>
      </section>

      {/* 源码展开抽屉 */}
      {showCode && (
        <section className="demo-scenarios__code-box">
          <div className="demo-scenarios__code-head">
            <AkOverline>COMPOSITION SOURCE // {activeScenario.toUpperCase()} SCENARIO TSX</AkOverline>
            <span style={{ fontSize: '0.7rem', color: 'var(--ak-text-muted)', fontFamily: 'var(--ak-font-mono)' }}>
              100% Type-Safe · Pure CSS Variables · Concurrent Safe
            </span>
          </div>
          <pre className="demo-scenarios__code-pre">
            <code>{getCodeSnippet(activeScenario)}</code>
          </pre>
        </section>
      )}

      {/* 场景 01：分布式集群与节点遥测终端 */}
      {activeScenario === 'cluster' && (
        <div className="demo-scenario-content">
          {/* 实时动态状态条 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div className="demo-ticker">
              <span className="demo-ticker__dot" />
              <span>{liveTicker}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <AkChoice
                variant="switch"
                checked={livePulse}
                onChange={(e) => {
                  playTactileSound('toggle', 0.15)
                  setLivePulse(e.target.checked)
                }}
              >
                LIVE PULSE // 实时心跳抖动
              </AkChoice>
            </div>
          </div>

          {/* 实时全局指标矩阵 */}
          <div className="demo-telemetry__metrics-grid">
            <AkCard as="article" variant="glass" chamfer>
              <AkCardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <AkOverline>CLUSTER CPU WORKLOAD</AkOverline>
                  <AkTag variant="advanced">ACTIVE</AkTag>
                </div>
                <AkCardTitle style={{ fontSize: '1.6rem', fontFamily: 'var(--ak-font-mono)', fontWeight: 900 }}>
                  <AkCountUp value={Math.round(68 + cpuJitter)} duration={800} />.4%
                </AkCardTitle>
              </AkCardHeader>
              <AkCardContent>
                <AkProgress value={Math.min(100, Math.round(68 + cpuJitter))} label="CORE USAGE (128 vCPUs)" />
              </AkCardContent>
            </AkCard>

            <AkCard as="article" variant="glass" chamfer>
              <AkCardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <AkOverline>HEALTH STATUS</AkOverline>
                  <AkStatus size="sm" variant={drainedNodeIds.length > 0 ? 'warning' : 'default'} label={drainedNodeIds.length > 0 ? 'PARTIAL' : 'HEALTHY'} />
                </div>
                <AkCardTitle style={{ fontSize: '1.6rem', fontFamily: 'var(--ak-font-mono)', fontWeight: 900 }}>
                  {4 - drainedNodeIds.length} / 4 <span style={{ fontSize: '0.9rem', color: 'var(--ak-text-muted)' }}>ONLINE</span>
                </AkCardTitle>
              </AkCardHeader>
              <AkCardContent>
                <AkProgress value={drainedNodeIds.length > 0 ? 75 : 100} label="CONSENSUS QUORUM" />
              </AkCardContent>
            </AkCard>

            <AkCard as="article" variant="glass" chamfer>
              <AkCardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <AkOverline>NETWORK THROUGHPUT</AkOverline>
                  <AkTag variant="neutral">WAN-01</AkTag>
                </div>
                <AkCardTitle style={{ fontSize: '1.6rem', fontFamily: 'var(--ak-font-mono)', fontWeight: 900 }}>
                  {(4.82 + cpuJitter * 0.05).toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--ak-text-muted)' }}>GB/s</span>
                </AkCardTitle>
              </AkCardHeader>
              <AkCardContent>
                <AkGauge label="BANDWIDTH UTILIZATION" value={54} unit="%" />
              </AkCardContent>
            </AkCard>

            <AkCard as="article" variant="glass" chamfer>
              <AkCardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <AkOverline>P99 RPC LATENCY</AkOverline>
                  <AkStatus size="sm" variant="default" label="OPTIMAL" />
                </div>
                <AkCardTitle style={{ fontSize: '1.6rem', fontFamily: 'var(--ak-font-mono)', fontWeight: 900 }}>
                  1.24 <span style={{ fontSize: '0.9rem', color: 'var(--ak-text-muted)' }}>ms</span>
                </AkCardTitle>
              </AkCardHeader>
              <AkCardContent>
                <AkProgress value={18} variant="default" label="MAX THRESHOLD (50ms)" />
              </AkCardContent>
            </AkCard>
          </div>

          {/* 节点选择器与详情工作台 */}
          <div className="demo-telemetry__body-grid">
            {/* 左侧：物理节点卡片列表 */}
            <div className="demo-telemetry__node-list">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <AkOverline>CLUSTER TOPOLOGY NODES ({CLUSTER_NODES.length})</AkOverline>
                <span className="demo-note">Click node to inspect</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {CLUSTER_NODES.map((node) => {
                  const isSelected = selectedNodeId === node.id
                  const isCordoned = drainedNodeIds.includes(node.id)
                  const displayCpu = isCordoned ? 0 : Math.min(100, Math.max(5, Math.round(node.cpu + cpuJitter)))
                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        playTactileSound('click', 0.15)
                        setSelectedNodeId(node.id)
                      }}
                      style={{ cursor: 'pointer', opacity: isCordoned ? 0.75 : 1 }}
                    >
                      <AkCard
                        as="div"
                        variant={isSelected ? 'tactical' : 'outline'}
                        chamfer={isSelected}
                        hoverable
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 800, fontFamily: 'var(--ak-font-mono)', fontSize: '0.85rem' }}>{node.name}</span>
                          <AkStatus
                            size="sm"
                            variant={isCordoned ? 'warning' : node.status === 'warning' ? 'warning' : 'default'}
                            label={isCordoned ? 'CORDONED' : node.status === 'warning' ? 'WARN' : 'NOMINAL'}
                          />
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--ak-text-muted)', fontFamily: 'var(--ak-font-mono)', marginBottom: '0.5rem' }}>
                          {node.role} · {node.ip}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                          <AkProgress label="CPU" value={displayCpu} variant={displayCpu > 80 ? 'danger' : 'default'} />
                          <AkProgress label="MEM" value={isCordoned ? 8 : node.mem} variant={node.mem > 80 ? 'warning' : 'default'} />
                        </div>
                      </AkCard>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 右侧：所选节点深度剖析机匣 */}
            <div className="demo-telemetry__detail-panel">
              <AkCard as="section" variant="chassis">
                <AkCardHeader>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <AkBilingual cn="节点遥测剖析" en={`${selectedNode.name} DEEP TELEMETRY`} />
                      <AkCardDescription>
                        IP: {selectedNode.ip} · Uptime: {selectedNode.uptime} · Status:{' '}
                        {drainedNodeIds.includes(selectedNode.id) ? 'CORDONED // 维护隔离' : selectedNode.statusLabel}
                      </AkCardDescription>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {drainedNodeIds.includes(selectedNode.id) ? (
                        <AkButton
                          variant="action"
                          chamfer
                          size="sm"
                          onClick={() => {
                            playTactileSound('confirm', 0.18)
                            setDrainedNodeIds((prev) => prev.filter((id) => id !== selectedNode.id))
                            setClusterNotice(`[UNCORDON] ${selectedNode.name} returned to active scheduling pool.`)
                            setTimeout(() => setClusterNotice(null), 3500)
                          }}
                        >
                          UNCORDON // 恢复调度
                        </AkButton>
                      ) : (
                        <AkButton
                          variant="danger"
                          chamfer
                          size="sm"
                          onClick={() => {
                            playTactileSound('warn', 0.2)
                            setDrainDialogOpen(true)
                          }}
                        >
                          DRAIN NODE // 驱逐负载
                        </AkButton>
                      )}
                      <AkButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          playTactileSound('confirm', 0.18)
                          setClusterNotice(`[DAEMON RESTARTED] Telemetry agent on ${selectedNode.name} reloaded.`)
                          setTimeout(() => setClusterNotice(null), 3000)
                        }}
                      >
                        RESTART DAEMON
                      </AkButton>
                    </div>
                  </div>
                </AkCardHeader>

                <AkCardContent>
                  {clusterNotice && (
                    <AkNotice title="SYSTEM NOTICE" code="STATUS_OK" style={{ marginBottom: '1rem' }}>
                      {clusterNotice}
                    </AkNotice>
                  )}

                  {/* 进程快速过滤工具条 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <AkInput
                      size="sm"
                      placeholder="Filter active processes by name or PID..."
                      value={procSearch}
                      onChange={(e) => setProcSearch(e.target.value)}
                      style={{ maxWidth: '20rem' }}
                    />
                    <span className="demo-note">{sortedProcesses.length} processes registered</span>
                  </div>

                  {/* 真实进程表格 */}
                  <AkTable
                    tactical
                    striped
                    columns={[
                      {
                        key: 'pid',
                        header: 'PID',
                        sort: sortKey === 'pid' ? sortDir : 'none',
                        onSortChange: () => handleSortChange('pid'),
                      },
                      {
                        key: 'process',
                        header: 'PROCESS BINARY',
                        sort: sortKey === 'process' ? sortDir : 'none',
                        onSortChange: () => handleSortChange('process'),
                      },
                      {
                        key: 'cpu',
                        header: 'CPU %',
                        numeric: true,
                        sort: sortKey === 'cpu' ? sortDir : 'none',
                        onSortChange: () => handleSortChange('cpu'),
                      },
                      { key: 'mem', header: 'MEMORY ALLOC', numeric: true },
                      { key: 'status', header: 'THREAD STATE' },
                      { key: 'actions', header: 'ACTION' },
                    ]}
                    rows={sortedProcesses.map((proc) => ({
                      id: proc.pid,
                      cells: {
                        pid: <code style={{ fontFamily: 'var(--ak-font-mono)' }}>{proc.pid}</code>,
                        process: <strong>{proc.process}</strong>,
                        cpu: `${proc.cpu.toFixed(1)}%`,
                        mem: proc.mem,
                        status: proc.status,
                        actions: (
                          <AkButton
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              playTactileSound('warn', 0.2)
                              setProcessMap((prev) => ({
                                ...prev,
                                [selectedNode.id]: (prev[selectedNode.id] ?? []).filter((p) => p.pid !== proc.pid),
                              }))
                              setClusterNotice(`[SIGTERM] Process PID ${proc.pid} terminated on ${selectedNode.name}.`)
                              setTimeout(() => setClusterNotice(null), 3000)
                            }}
                          >
                            KILL
                          </AkButton>
                        ),
                      },
                    }))}
                  />
                </AkCardContent>
              </AkCard>
            </div>
          </div>

          {/* 驱逐节点危险确认弹窗 */}
          <AkDialog
            open={drainDialogOpen}
            onOpenChange={setDrainDialogOpen}
            eyebrow="EMERGENCY ACTION // CLUSTER PROTECTION"
            title={`DRAIN AND CORDON ${selectedNode.name}?`}
            footer={
              <>
                <AkButton variant="outline" size="sm" onClick={() => setDrainDialogOpen(false)}>
                  CANCEL // 取消
                </AkButton>
                <AkButton
                  variant="danger"
                  chamfer
                  size="sm"
                  onClick={() => {
                    playTactileSound('confirm', 0.25)
                    setDrainDialogOpen(false)
                    setDrainedNodeIds((prev) => (prev.includes(selectedNode.id) ? prev : [...prev, selectedNode.id]))
                    setClusterNotice(`[CORDON SUCCESS] ${selectedNode.name} cordoned and scheduled for workload evacuation.`)
                    setTimeout(() => setClusterNotice(null), 4000)
                  }}
                >
                  CONFIRM DRAIN // 确认驱逐
                </AkButton>
              </>
            }
          >
            <p className="ak-text">
              您即将驱逐并封锁节点 <strong>{selectedNode.name} ({selectedNode.ip})</strong>。
              该节点上的全部容器 Pod 将被安全调度至其他健康节点，此操作将触发网络重新路由。
            </p>
          </AkDialog>
        </div>
      )}

      {/* 场景 02：任务编排与自动化部署流水线 */}
      {activeScenario === 'pipeline' && (
        <div className="demo-scenario-content">
          {/* 流水线阶段步进器 */}
          <AkCard as="section" variant="tactical" chamfer style={{ marginBottom: '1.25rem' }}>
            <AkCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <AkDisplay>PIPELINE: PROD-RELEASE-V2.4.0</AkDisplay>
                  <AkCardDescription>Triggered by commit `deae399` on master · Automated Rollout Engine</AkCardDescription>
                </div>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <AkButton
                    variant={isAutoRunning ? 'default' : 'action'}
                    chamfer
                    size="sm"
                    disabled={isAutoRunning}
                    onClick={handleStartAutoRun}
                  >
                    {isAutoRunning ? 'RUNNING... // 正在演练' : '▶ RUN FULL PIPELINE // 启动完整流水线演练'}
                  </AkButton>
                  <AkButton
                    variant="danger"
                    chamfer
                    size="sm"
                    onClick={() => {
                      playTactileSound('warn', 0.2)
                      setRollbackDialogOpen(true)
                    }}
                  >
                    HALT & ROLLBACK // 紧急熔断
                  </AkButton>
                </div>
              </div>
            </AkCardHeader>

            <AkCardContent>
              {/* 四阶段指示条 */}
              <div className="demo-pipeline__stages-row">
                {[
                  { index: 0, title: '01. STATIC AUDIT', sub: 'AST & LINT PASS', status: pipelineStep > 0 ? 'COMPLETED' : pipelineStep === 0 ? 'IN PROGRESS' : 'STANDBY' },
                  { index: 1, title: '02. HERMETIC BUILD', sub: 'MULTI-STAGE DOCKER', status: pipelineStep > 1 ? 'COMPLETED' : pipelineStep === 1 ? 'IN PROGRESS' : 'STANDBY' },
                  { index: 2, title: '03. SBOM & CVE SCAN', sub: 'VULNERABILITY AUDIT', status: pipelineStep > 2 ? 'COMPLETED' : pipelineStep === 2 ? 'IN PROGRESS' : 'STANDBY' },
                  { index: 3, title: '04. CANARY ROLLOUT', sub: '20% -> 100% TRAFFIC', status: pipelineStep >= 3 ? 'DEPLOYED' : 'STANDBY' },
                ].map((st) => {
                  const isCurrent = pipelineStep === st.index
                  const isDone = pipelineStep > st.index
                  return (
                    <div
                      key={st.title}
                      className={`demo-pipeline__stage-card ${isCurrent ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                      onClick={() => {
                        playTactileSound('click', 0.15)
                        setPipelineStep(st.index)
                      }}
                    >
                      <div className="demo-pipeline__stage-badge">
                        {isDone ? '✓ DONE' : isCurrent ? '⚡ RUNNING' : '○ QUEUED'}
                      </div>
                      <strong className="demo-pipeline__stage-name">{st.title}</strong>
                      <span className="demo-pipeline__stage-sub">{st.sub}</span>
                    </div>
                  )
                })}
              </div>

              {/* 实时演练执行进度条 */}
              <div style={{ marginTop: '1.25rem' }}>
                <AkProgress
                  label={`CURRENT STAGE EXECUTION PROGRESS: ${pipelineStep === 0 ? 'STATIC AUDIT' : pipelineStep === 1 ? 'OCI BUILD' : pipelineStep === 2 ? 'TRIVY SCAN' : 'CANARY TRAFFIC'}`}
                  value={autoRunProgress}
                  variant={autoRunProgress >= 100 ? 'default' : 'default'}
                />
              </div>
            </AkCardContent>
          </AkCard>

          {/* 实时反馈与参数控制双栏 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(22rem, 1fr))', gap: '1.25rem' }}>
            {/* 左机匣：实时控制参数 */}
            <AkCard as="section" variant="chassis">
              <AkCardHeader>
                <AkBilingual cn="调度与熔断控制" en="DISPATCH & CIRCUIT BREAKER TUNING" />
                <AkCardDescription>Real-time orchestration hyperparameters</AkCardDescription>
              </AkCardHeader>
              <AkCardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <AkField>
                    <AkFieldLabel>WORKER CONCURRENCY (线程并发上限)</AkFieldLabel>
                    <AkInputNumber
                      value={pipelineConcurrency}
                      min={1}
                      max={32}
                      step={2}
                      onValueChange={(val) => {
                        playTactileSound('dial', 0.15)
                        setPipelineConcurrency(val)
                      }}
                    />
                  </AkField>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <AkChoice
                      variant="switch"
                      checked={autoRollback}
                      onChange={(e) => {
                        playTactileSound('toggle', 0.15)
                        setAutoRollback(e.target.checked)
                      }}
                    >
                      AUTO-ROLLBACK ON SMOKE-TEST ANOMALY
                    </AkChoice>

                    <AkChoice
                      variant="switch"
                      checked={twoFactorEnforce}
                      onChange={(e) => {
                        playTactileSound('toggle', 0.15)
                        setTwoFactorEnforce(e.target.checked)
                      }}
                    >
                      REQUIRE 2FA APPROVAL FOR CANARY PROMOTION
                    </AkChoice>
                  </div>
                </div>
              </AkCardContent>
            </AkCard>

            {/* 右机匣：实时通知信标堆叠 */}
            <AkCard as="section" variant="chassis">
              <AkCardHeader>
                <AkBilingual cn="调度实时事件堆叠" en="LIVE DISPATCH NOTICE STACK" />
                <AkCardDescription>Streaming build logs & consensus notices</AkCardDescription>
              </AkCardHeader>
              <AkCardContent>
                {pipelineNotice && (
                  <AkNotice
                    title="ACTIVE RUN UPDATE"
                    variant="info"
                    code="PRTS_CI"
                    style={{ marginBottom: '0.75rem' }}
                  >
                    {pipelineNotice}
                  </AkNotice>
                )}

                <AkNoticeStack>
                  <AkNotice
                    variant="success"
                    title="CONTAINER SIGNATURE VERIFIED"
                    code="COSIGN_OK"
                  >
                    Digest sha256:8f4e2b19 cryptographically signed by Rhodes KMS key.
                  </AkNotice>
                  <AkNotice
                    variant="info"
                    title="TRIVY SCAN COMPLETED"
                    code="CVE_CLEAN"
                  >
                    0 Critical, 0 High vulnerabilities found in rootfs layers.
                  </AkNotice>
                  <AkNotice
                    variant="warning"
                    title="CANARY ANOMALY THRESHOLD"
                    code="WATCH_DOG"
                  >
                    P99 latency monitored at 14ms (alert trigger threshold: 50ms).
                  </AkNotice>
                </AkNoticeStack>
              </AkCardContent>
            </AkCard>
          </div>

          {/* 紧急回滚确认弹窗 */}
          <AkDialog
            open={rollbackDialogOpen}
            onOpenChange={setRollbackDialogOpen}
            eyebrow="CIRCUIT BREAKER // SAFETY INTERLOCK"
            title="EMERGENCY ROLLBACK TO PREVIOUS SHA?"
            footer={
              <>
                <AkButton variant="outline" size="sm" onClick={() => setRollbackDialogOpen(false)}>
                  CANCEL // 取消
                </AkButton>
                <AkButton
                  variant="danger"
                  chamfer
                  size="sm"
                  onClick={handleAbortPipeline}
                >
                  CONFIRM HALT // 确认熔断
                </AkButton>
              </>
            }
          >
            <p className="ak-text">
              此操作将发送 SIGTERM 阻断正在运行的构建沙盒，并将生产流量 100% 切换回前一已知健康版本 (v2.3.9)。
            </p>
          </AkDialog>
        </div>
      )}

      {/* 场景 03：安全审计与权限监控终端 */}
      {activeScenario === 'audit' && (
        <div className="demo-scenario-content">
          <AkCard as="section" variant="tactical" chamfer>
            <AkCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <AkDisplay>SECURITY AUDIT LOGS // 安全合规审计终端</AkDisplay>
                  <AkCardDescription>Real-time audit telemetry & access policy enforcement</AkCardDescription>
                </div>
                {/* 安全策略开关组 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <AkChoice variant="switch" checked={mfaSwitch} onChange={(e) => setMfaSwitch(e.target.checked)}>
                    STRICT MFA
                  </AkChoice>
                  <AkChoice variant="switch" checked={ipWhitelistSwitch} onChange={(e) => setIpWhitelistSwitch(e.target.checked)}>
                    IP WHITELIST
                  </AkChoice>
                </div>
              </div>
            </AkCardHeader>

            <AkCardContent>
              {auditNotice && (
                <AkNotice
                  title="SECURITY EVENT DISPATCH"
                  variant="warning"
                  code="AUDIT_GUARD"
                  style={{ marginBottom: '1rem' }}
                >
                  {auditNotice}
                </AkNotice>
              )}

              {/* 过滤与检索工具栏 */}
              <div className="demo-audit__toolbar">
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <AkInput
                    placeholder="Filter by operator, IP, or action keyword..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    style={{ maxWidth: '20rem' }}
                  />

                  <AkSegmented
                    size="sm"
                    ariaLabel="Severity Filter"
                    options={[
                      { label: 'ALL EVENTS', value: 'all' },
                      { label: 'INFO', value: 'info' },
                      { label: 'WARNING', value: 'warning' },
                      { label: 'CRITICAL', value: 'danger' },
                    ]}
                    value={auditFilter}
                    onValueChange={(val) => {
                      playTactileSound('click', 0.15)
                      setAuditFilter(val as any)
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AkButton
                    size="sm"
                    variant="danger"
                    chamfer
                    onClick={handleSimulateThreat}
                  >
                    INJECT THREAT TEST // 注入威胁测试
                  </AkButton>
                  <AkButton
                    size="sm"
                    variant="outline"
                    onClick={handleExportAudits}
                  >
                    EXPORT JSON // 导出快照
                  </AkButton>
                </div>
              </div>

              {/* 审计日志数据表 */}
              <div style={{ marginTop: '1rem' }}>
                <AkTable
                  scrollable
                  tactical
                  striped
                  columns={[
                    { key: 'time', header: 'TIMESTAMP' },
                    { key: 'severity', header: 'SEVERITY' },
                    { key: 'operator', header: 'OPERATOR IDENTITY' },
                    { key: 'ip', header: 'SOURCE IP' },
                    { key: 'action', header: 'ACTION DESCRIPTION' },
                  ]}
                  rows={filteredAudits.map((ev) => ({
                    id: ev.id,
                    cells: {
                      time: ev.time,
                      severity: (
                        <AkTag variant={ev.severity === 'danger' ? 'danger' : ev.severity === 'warning' ? 'advanced' : 'neutral'}>
                          {ev.severity.toUpperCase()}
                        </AkTag>
                      ),
                      operator: ev.operator,
                      ip: (
                        <span style={{ fontFamily: 'var(--ak-font-mono)', color: blockedIps.includes(ev.ip) ? 'var(--ak-signal-danger)' : 'inherit' }}>
                          {ev.ip} {blockedIps.includes(ev.ip) ? '(BLOCKED)' : ''}
                        </span>
                      ),
                      action: ev.action,
                    },
                    selected: inspectAudit?.id === ev.id,
                  }))}
                  onRowClick={(row) => {
                    const found = auditList.find((e) => e.id === row.id)
                    if (found) {
                      playTactileSound('click', 0.15)
                      setInspectAudit(found)
                    }
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span className="demo-note">Showing {filteredAudits.length} recorded audit events. Click any row to inspect deep packet metadata.</span>
                <AkPagination page={1} total={4} onPageChange={() => playTactileSound('dial', 0.15)} />
              </div>
            </AkCardContent>
          </AkCard>

          {/* 审计事件深度详情弹窗 */}
          {inspectAudit && (
            <AkDialog
              open={true}
              onOpenChange={(open) => {
                if (!open) setInspectAudit(null)
              }}
              eyebrow="AUDIT RECORD INSPECTOR"
              title={`EVENT #${inspectAudit.id}: ${inspectAudit.action}`}
              footer={
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  {blockedIps.includes(inspectAudit.ip) ? (
                    <AkButton variant="outline" size="sm" disabled>
                      IP ALREADY BLOCKED // 已加入防火墙黑名单
                    </AkButton>
                  ) : (
                    <AkButton
                      variant="danger"
                      chamfer
                      size="sm"
                      onClick={() => {
                        playTactileSound('confirm', 0.2)
                        setBlockedIps((prev) => [...prev, inspectAudit.ip])
                        setAuditNotice(`[FIREWALL RECONFIGURED] Client IP ${inspectAudit.ip} blocked across ingress border.`)
                        setInspectAudit(null)
                      }}
                    >
                      BLOCK CLIENT IP // 封锁源 IP
                    </AkButton>
                  )}
                  <AkButton variant="action" size="sm" onClick={() => setInspectAudit(null)}>
                    CLOSE // 关闭
                  </AkButton>
                </div>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', fontFamily: 'var(--ak-font-mono)', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--ak-text-muted)' }}>TIMESTAMP:</span>
                  <strong>{inspectAudit.time} (UTC+8)</strong>
                  <span style={{ color: 'var(--ak-text-muted)' }}>OPERATOR:</span>
                  <strong>{inspectAudit.operator}</strong>
                  <span style={{ color: 'var(--ak-text-muted)' }}>CLIENT IP:</span>
                  <strong>{inspectAudit.ip}</strong>
                  <span style={{ color: 'var(--ak-text-muted)' }}>SEVERITY:</span>
                  <AkTag variant={inspectAudit.severity === 'danger' ? 'danger' : inspectAudit.severity === 'warning' ? 'advanced' : 'neutral'}>
                    {inspectAudit.severity.toUpperCase()}
                  </AkTag>
                </div>
                <div style={{ padding: '0.75rem', background: 'var(--ak-surface-sunken)', border: '1px solid var(--demo-hairline)', fontSize: '0.75rem', fontFamily: 'var(--ak-font-mono)' }}>
                  <code>
                    {`{\n  "event_id": "${inspectAudit.id}",\n  "trace_id": "tr-7f9a8820c4",\n  "auth_method": "mTLS + RBAC v2",\n  "enforced_policy": "ZeroTrust_Level_4",\n  "blocked": ${blockedIps.includes(inspectAudit.ip)}\n}`}
                  </code>
                </div>
              </div>
            </AkDialog>
          )}
        </div>
      )}

      {/* 场景 04：故障应急作战室与服务网格 */}
      {activeScenario === 'warroom' && (
        <div className="demo-scenario-content">
          {/* 事故作战室紧急横幅 */}
          <div className={`demo-warroom__banner ${incidentStatus === 'resolved' ? 'is-resolved' : ''}`}>
            <div className="demo-warroom__banner-left">
              <div className="demo-warroom__banner-title">
                <span
                  className="demo-hero__badge-dot"
                  style={{
                    background: incidentStatus === 'resolved' ? 'var(--ak-signal-action)' : 'var(--ak-signal-danger)',
                  }}
                />
                <span>
                  {incidentStatus === 'resolved'
                    ? 'INC-2026-8841 // ALL SYSTEMS RESTORED NOMINAL'
                    : 'SEV-1 PRODUCTION INCIDENT // EU-WEST CORE CHECKOUT DEGRADATION'}
                </span>
                <AkTag variant={incidentStatus === 'resolved' ? 'advanced' : incidentStatus === 'mitigated' ? 'default' : 'danger'}>
                  {incidentStatus === 'resolved' ? 'RESOLVED' : incidentStatus === 'mitigated' ? 'MITIGATED' : 'ACTIVE OUTAGE'}
                </AkTag>
              </div>
              <div className="demo-warroom__banner-meta">
                COMMANDER: DOCTOR // INCIDENT TIME: 00:24:18 (UTC+8) · AFFECTED SCOPE: 14.8% OF CHECKOUT CALLS
              </div>
            </div>

            <div className="demo-warroom__banner-actions">
              <AkButton
                size="sm"
                variant={incidentStatus === 'resolved' ? 'outline' : 'danger'}
                chamfer
                onClick={() => setPageDialogOpen(true)}
              >
                PAGE ON-CALL COMMANDER // 呼叫值班 SRE
              </AkButton>

              <AkButton
                size="sm"
                variant={isCheckoutTripped ? 'action' : 'outline'}
                onClick={toggleCircuitBreaker}
              >
                {isCheckoutTripped ? 'RESET BREAKER // 重置熔断' : 'TRIP CIRCUIT BREAKER // 熔断故障核心'}
              </AkButton>

              <AkButton
                size="sm"
                variant={incidentStatus === 'resolved' ? 'outline' : 'action'}
                chamfer
                onClick={handleResolveIncident}
              >
                {incidentStatus === 'resolved' ? 'REOPEN INCIDENT // 重新打开' : 'RESOLVE INCIDENT // 标记事故已恢复'}
              </AkButton>
            </div>
          </div>

          {warroomNotice && (
            <AkNotice
              title="INCIDENT ACTION LOG"
              variant={incidentStatus === 'resolved' ? 'success' : 'warning'}
              code="SRE_DISPATCH"
              style={{ marginBottom: '1.25rem' }}
            >
              {warroomNotice}
            </AkNotice>
          )}

          {/* 服务网格微服务矩阵 */}
          <div className="demo-warroom__grid">
            {meshServices.map((svc) => {
              const isSelected = selectedMeshService.id === svc.id
              return (
                <div
                  key={svc.id}
                  onClick={() => {
                    playTactileSound('click', 0.15)
                    setSelectedServiceId(svc.id)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <AkCard
                    variant={isSelected ? 'tactical' : 'outline'}
                    chamfer={isSelected}
                    hoverable
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontFamily: 'var(--ak-font-mono)', fontWeight: 800, fontSize: '0.82rem' }}>{svc.name}</span>
                      <AkStatus
                        size="sm"
                        variant={svc.status === 'healthy' ? 'default' : svc.status === 'degraded' ? 'warning' : 'critical'}
                        label={svc.status.toUpperCase()}
                      />
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--ak-text-muted)', fontFamily: 'var(--ak-font-mono)', marginBottom: '0.6rem' }}>
                      {svc.role}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--ak-font-mono)' }}>
                      <div>
                        <span style={{ color: 'var(--ak-text-muted)' }}>LATENCY: </span>
                        <strong style={{ color: svc.latency > 200 ? 'var(--ak-signal-danger)' : 'inherit' }}>{svc.latency}ms</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--ak-text-muted)' }}>P99: </span>
                        <strong style={{ color: svc.p99 > 500 ? 'var(--ak-signal-danger)' : 'inherit' }}>{svc.p99}ms</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--ak-text-muted)' }}>ERR: </span>
                        <strong style={{ color: svc.errorRate > 1 ? 'var(--ak-signal-danger)' : 'inherit' }}>{svc.errorRate}%</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--ak-text-muted)' }}>BREAKER: </span>
                        <strong>{svc.circuitBreaker.toUpperCase()}</strong>
                      </div>
                    </div>
                  </AkCard>
                </div>
              )
            })}
          </div>

          {/* 跨区域流量热切编排机匣 */}
          <AkCard variant="chassis" chamfer>
            <AkCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <AkBilingual cn="跨区域流量热切编排" en="CROSS-REGION TRAFFIC FAILOVER STEERING" />
                  <AkCardDescription>
                    Adjust ingress gateway traffic ratio between EU-West (Degraded) and US-East (Standby).
                  </AkCardDescription>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AkTag variant={trafficRatio >= 80 ? 'advanced' : 'danger'}>
                    {`US-EAST: ${trafficRatio}% / EU-WEST: ${100 - trafficRatio}%`}
                  </AkTag>
                </div>
              </div>
            </AkCardHeader>
            <AkCardContent>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(18rem, 24rem) 1fr', gap: '1.5rem', alignItems: 'center' }}>
                <div>
                  <AkField>
                    <AkFieldLabel>{`TRAFFIC FAILOVER (US-EAST RATIO: ${trafficRatio}%)`}</AkFieldLabel>
                    <AkSlider
                      label={`TRAFFIC FAILOVER (US-EAST: ${trafficRatio}%)`}
                      value={trafficRatio}
                      min={0}
                      max={100}
                      step={10}
                      onValueChange={(val) => {
                        playTactileSound('dial', 0.12)
                        setTrafficRatio(val)
                        if (val >= 80 && incidentStatus === 'active') {
                          setIncidentStatus('mitigated')
                          setWarroomNotice('[FAILOVER APPLIED] 80%+ traffic routed to US-East standby pool. Customer impact mitigated.')
                        }
                      }}
                    />
                  </AkField>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--ak-text-muted)', fontFamily: 'var(--ak-font-mono)', marginTop: '0.4rem' }}>
                    <span>EU-WEST 100%</span>
                    <span>50/50 SPLIT</span>
                    <span>US-EAST 100% (FULL DRAIN)</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <AkCard variant="outline" chamfer>
                    <AkProgress label="INGRESS HEALTH RATIO" value={trafficRatio >= 80 ? 99 : 86} variant={trafficRatio >= 80 ? 'default' : 'warning'} />
                  </AkCard>
                  <AkCard variant="outline" chamfer>
                    <AkGauge value={trafficRatio >= 80 ? 99.92 : 85.2} label="AVAILABILITY SLA" max={100} />
                  </AkCard>
                  <AkCard variant="outline" chamfer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--ak-text-muted)', fontFamily: 'var(--ak-font-mono)' }}>DRAIN COMPLETION</span>
                      <strong style={{ fontSize: '1.4rem', fontFamily: 'var(--ak-font-mono)', color: 'var(--ak-signal-info)' }}>{trafficRatio}%</strong>
                      <span style={{ fontSize: '0.68rem', color: 'var(--ak-text-muted)' }}>Standby cluster healthy</span>
                    </div>
                  </AkCard>
                </div>
              </div>
            </AkCardContent>
          </AkCard>

          {/* 呼叫值班弹窗 */}
          <AkDialog
            open={pageDialogOpen}
            onOpenChange={setPageDialogOpen}
            eyebrow="EMERGENCY ESCALATION // ON-CALL ROTATION"
            title="PAGE ON-CALL COMMANDER & SRE TIER-1"
            footer={
              <>
                <AkButton variant="outline" size="sm" onClick={() => setPageDialogOpen(false)}>
                  CANCEL // 取消
                </AkButton>
                <AkButton
                  variant="action"
                  chamfer
                  size="sm"
                  onClick={() => {
                    playTactileSound('confirm', 0.25)
                    setPageDialogOpen(false)
                    setWarroomNotice('[PAGER SENT] High-urgency SMS & PagerDuty notification delivered to SRE Commander.')
                  }}
                >
                  DISPATCH PAGER // 确认呼叫
                </AkButton>
              </>
            }
          >
            <p className="ak-text">
              此操作将向值班应急梯队发送 P1 级电话唤醒与工单指派，确认针对 <strong>EU-WEST Core Checkout Degradation</strong> 建立跨组指挥会话。
            </p>
          </AkDialog>
        </div>
      )}
    </div>
  )
}

function getCodeSnippet(scenario: ScenarioId): string {
  switch (scenario) {
    case 'cluster':
      return `import { AkCard, AkTable, AkStatus, AkProgress, AkGauge, AkButton, AkDialog, AkCountUp } from '@swufefox/ak-ui-react'

export function ClusterStation() {
  const [selectedNode, setSelectedNode] = useState('node-alpha-01')
  const [drainOpen, setDrainOpen] = useState(false)

  return (
    <div className="telemetry-grid">
      {/* 1. Global Metrics */}
      <AkCard variant="glass" chamfer>
        <AkProgress value={68} label="CORE USAGE (128 vCPUs)" />
        <AkCountUp value={68} />
      </AkCard>

      {/* 2. Process Table with Sortable Columns */}
      <AkCard variant="chassis">
        <AkTable
          tactical
          striped
          columns={[
            { key: 'pid', header: 'PID', sort: 'descending' },
            { key: 'process', header: 'PROCESS' },
            { key: 'cpu', header: 'CPU %', numeric: true },
          ]}
          rows={processes}
        />
        <AkButton variant="danger" chamfer onClick={() => setDrainOpen(true)}>
          DRAIN NODE
        </AkButton>
      </AkCard>

      {/* 3. Safety Confirmation Dialog */}
      <AkDialog open={drainOpen} onOpenChange={setDrainOpen} title="Drain Node?">
        Workloads will be migrated safely to peer nodes.
      </AkDialog>
    </div>
  )
}`
    case 'pipeline':
      return `import { AkCard, AkNoticeStack, AkNotice, AkInputNumber, AkChoice, AkButton, AkDialog, AkProgress } from '@swufefox/ak-ui-react'

export function PipelineConsole() {
  const [stage, setStage] = useState(2)
  const [concurrency, setConcurrency] = useState(8)
  const [autoRollback, setAutoRollback] = useState(true)

  return (
    <AkCard variant="tactical" chamfer>
      {/* Real-time notices */}
      <AkNoticeStack>
        <AkNotice variant="success" title="ARTIFACT COMPILATION COMPLETE">
          Docker image signed and verified with cosign.
        </AkNotice>
      </AkNoticeStack>

      {/* Dynamic controls */}
      <AkInputNumber value={concurrency} onValueChange={setConcurrency} label="Workers" />
      <AkChoice variant="switch" checked={autoRollback} onChange={(e) => setAutoRollback(e.target.checked)}>
        Auto-Rollback on Error
      </AkChoice>

      <AkButton variant="action" chamfer onClick={() => setStage(s => s + 1)}>
        ADVANCE STAGE
      </AkButton>
    </AkCard>
  )
}`
    case 'audit':
      return `import { AkCard, AkTable, AkTag, AkInput, AkSegmented, AkChoice, AkPagination } from '@swufefox/ak-ui-react'

export function AuditDeck() {
  const [filter, setFilter] = useState('all')

  return (
    <AkCard variant="tactical" chamfer>
      <div className="toolbar">
        <AkInput placeholder="Filter audits..." />
        <AkSegmented options={['ALL', 'INFO', 'WARN', 'CRIT']} value={filter} onValueChange={setFilter} />
      </div>

      <AkTable
        tactical
        striped
        columns={columns}
        rows={filteredAudits}
        onRowClick={(row) => inspectDetails(row.id)}
      />
      <AkPagination page={1} total={10} />
    </AkCard>
  )
}`
    case 'warroom':
      return `import { AkCard, AkStatus, AkSlider, AkGauge, AkProgress, AkButton, AkDialog, AkTag } from '@swufefox/ak-ui-react'

export function IncidentWarRoom() {
  const [trafficRatio, setTrafficRatio] = useState(20)
  const [tripped, setTripped] = useState(false)

  return (
    <div className="war-room">
      <AkCard variant="chassis" chamfer>
        <AkSlider
          value={trafficRatio}
          onValueChange={setTrafficRatio}
          label="FAILOVER RATIO (STANDBY CLUSTER)"
        />
        <AkButton variant={tripped ? 'action' : 'danger'} onClick={() => setTripped(!tripped)}>
          {tripped ? 'RESET BREAKER' : 'TRIP CIRCUIT BREAKER'}
        </AkButton>
      </AkCard>
    </div>
  )
}`
  }
}
