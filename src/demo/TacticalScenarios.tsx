import { useState, useMemo, type ReactElement } from 'react'
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
  playTactileSound,
} from '../ak'
import { useI18n } from './i18n'

export type ScenarioId = 'cluster' | 'pipeline' | 'audit'

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

const PROCESS_LIST: Record<string, ProcessRow[]> = {
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

interface AuditEvent {
  id: string
  time: string
  operator: string
  ip: string
  action: string
  severity: 'info' | 'warning' | 'danger'
}

const AUDIT_EVENTS: AuditEvent[] = [
  { id: 'aud-901', time: '13:14:22', operator: 'OPS-LEAD // KALTSIT', ip: '10.240.0.4', action: 'APPLY CLUSTER SECURITY POLICY // TLS-1.3 ENFORCED', severity: 'info' },
  { id: 'aud-902', time: '13:12:08', operator: 'AUTOMATION // PRTS-DAEMON', ip: '10.240.0.1', action: 'AUTOSCALE TRIGGERED // +4 PODS IN WORKER-BETA', severity: 'info' },
  { id: 'aud-903', time: '13:08:44', operator: 'EXT-PROXY // 198.51.100.24', ip: '198.51.100.24', action: 'ANOMALOUS TCP BURST BLOCKED // WAF SHIELDED', severity: 'danger' },
  { id: 'aud-904', time: '12:59:15', operator: 'SYS-ADMIN // DOC-01', ip: '10.240.0.8', action: 'CONTAINER IMAGE DEPLOYED // SHA: 8F4E2B19', severity: 'info' },
  { id: 'aud-905', time: '12:45:30', operator: 'SECURITY-AGENT', ip: '10.240.1.15', action: 'CERTIFICATE ROTATION SCHEDULED // EXPIRING 7D', severity: 'warning' },
  { id: 'aud-906', time: '12:30:11', operator: 'AUDIT-CHECKER', ip: '10.240.0.1', action: 'ZERO TRUST MTLS VERIFICATION SUCCESS', severity: 'info' },
]

export interface TacticalScenariosViewProps {
  onBrowseCatalogue?: () => void
}

export function TacticalScenariosView({ onBrowseCatalogue }: TacticalScenariosViewProps = {}): ReactElement {
  const { locale } = useI18n()
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('cluster')
  const [showCode, setShowCode] = useState(false)

  // 场景 01 状态：集群遥测
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-alpha-01')
  const [drainDialogOpen, setDrainDialogOpen] = useState(false)
  const [drainedNodeIds, setDrainedNodeIds] = useState<string[]>([])
  const [clusterNotice, setClusterNotice] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<'pid' | 'process' | 'cpu'>('cpu')
  const [sortDir, setSortDir] = useState<'ascending' | 'descending' | 'none'>('descending')

  // 场景 02 状态：流水线
  const [pipelineStep, setPipelineStep] = useState<number>(2) // 0: Quality, 1: Build, 2: Scan, 3: Deploy
  const [pipelineConcurrency, setPipelineConcurrency] = useState<number>(8)
  const [autoRollback, setAutoRollback] = useState<boolean>(true)
  const [twoFactorEnforce, setTwoFactorEnforce] = useState<boolean>(true)
  const [rollbackDialogOpen, setRollbackDialogOpen] = useState<boolean>(false)
  const [pipelineNotice, setPipelineNotice] = useState<string | null>(null)

  // 场景 03 状态：安全审计
  const [auditFilter, setAuditFilter] = useState<'all' | 'info' | 'warning' | 'danger'>('all')
  const [auditSearch, setAuditSearch] = useState<string>('')
  const [mfaSwitch, setMfaSwitch] = useState<boolean>(true)
  const [ipWhitelistSwitch, setIpWhitelistSwitch] = useState<boolean>(true)
  const [inspectAudit, setInspectAudit] = useState<AuditEvent | null>(null)

  const selectedNode = CLUSTER_NODES.find((n) => n.id === selectedNodeId) ?? CLUSTER_NODES[0]
  const currentProcesses = PROCESS_LIST[selectedNode.id] ?? []

  const sortedProcesses = useMemo(() => {
    const list = [...currentProcesses]
    if (sortDir === 'none') return list
    return list.sort((a, b) => {
      const valA = a[sortKey]
      const valB = b[sortKey]
      const diff = typeof valA === 'number' && typeof valB === 'number'
        ? valA - valB
        : String(valA).localeCompare(String(valB))
      return sortDir === 'ascending' ? diff : -diff
    })
  }, [currentProcesses, sortKey, sortDir])

  const filteredAudits = useMemo(() => {
    return AUDIT_EVENTS.filter((ev) => {
      if (auditFilter !== 'all' && ev.severity !== auditFilter) return false
      if (auditSearch.trim()) {
        const q = auditSearch.toLowerCase()
        return ev.action.toLowerCase().includes(q) || ev.operator.toLowerCase().includes(q) || ev.ip.includes(q)
      }
      return true
    })
  }, [auditFilter, auditSearch])

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
          {/* 实时全局指标矩阵 */}
          <div className="demo-telemetry__metrics-grid">
            <AkCard as="article" variant="glass" chamfer>
              <AkCardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <AkOverline>CLUSTER CPU WORKLOAD</AkOverline>
                  <AkTag variant="advanced">ACTIVE</AkTag>
                </div>
                <AkCardTitle style={{ fontSize: '1.6rem', fontFamily: 'var(--ak-font-mono)', fontWeight: 900 }}>
                  <AkCountUp value={68} duration={800} />.4%
                </AkCardTitle>
              </AkCardHeader>
              <AkCardContent>
                <AkProgress value={68} label="CORE USAGE (128 vCPUs)" />
              </AkCardContent>
            </AkCard>

            <AkCard as="article" variant="glass" chamfer>
              <AkCardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <AkOverline>HEALTH STATUS</AkOverline>
                  <AkStatus size="sm" variant="default" label="HEALTHY" />
                </div>
                <AkCardTitle style={{ fontSize: '1.6rem', fontFamily: 'var(--ak-font-mono)', fontWeight: 900 }}>
                  16 / 16 <span style={{ fontSize: '0.9rem', color: 'var(--ak-text-muted)' }}>ONLINE</span>
                </AkCardTitle>
              </AkCardHeader>
              <AkCardContent>
                <AkProgress value={100} label="CONSENSUS QUORUM" />
              </AkCardContent>
            </AkCard>

            <AkCard as="article" variant="glass" chamfer>
              <AkCardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <AkOverline>NETWORK THROUGHPUT</AkOverline>
                  <AkTag variant="neutral">WAN-01</AkTag>
                </div>
                <AkCardTitle style={{ fontSize: '1.6rem', fontFamily: 'var(--ak-font-mono)', fontWeight: 900 }}>
                  4.82 <span style={{ fontSize: '0.9rem', color: 'var(--ak-text-muted)' }}>GB/s</span>
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
              <AkOverline>CLUSTER TOPOLOGY // 拓扑节点</AkOverline>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
                {CLUSTER_NODES.map((node) => {
                  const isSelected = selectedNodeId === node.id
                  const isCordoned = drainedNodeIds.includes(node.id)
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
                          <AkProgress label="CPU" value={isCordoned ? 0 : node.cpu} variant={node.cpu > 80 ? 'danger' : 'default'} />
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

                  <div style={{ marginBottom: '0.5rem' }}>
                    <AkOverline>ACTIVE WORKLOAD PROCESSES // 当前调度进程 (Click header to sort)</AkOverline>
                  </div>

                  <AkTable
                    scrollable
                    tactical
                    striped
                    columns={[
                      { key: 'pid', header: 'PID', sort: sortKey === 'pid' ? sortDir : 'none', onSortChange: () => handleSortChange('pid') },
                      { key: 'process', header: 'PROCESS COMMAND', sort: sortKey === 'process' ? sortDir : 'none', onSortChange: () => handleSortChange('process') },
                      { key: 'cpu', header: 'CPU %', numeric: true, sort: sortKey === 'cpu' ? sortDir : 'none', onSortChange: () => handleSortChange('cpu') },
                      { key: 'mem', header: 'MEMORY RSS', numeric: true },
                      { key: 'status', header: 'STATE' },
                    ]}
                    rows={sortedProcesses.map((proc) => ({
                      id: proc.pid,
                      cells: {
                        pid: proc.pid,
                        process: proc.process,
                        cpu: `${proc.cpu}%`,
                        mem: proc.mem,
                        status: proc.status,
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
                    variant="action"
                    chamfer
                    size="sm"
                    disabled={pipelineStep >= 3}
                    onClick={() => {
                      playTactileSound('confirm', 0.2)
                      setPipelineStep((s) => Math.min(3, s + 1))
                      setPipelineNotice('Stage advanced successfully. Metrics nominal.')
                      setTimeout(() => setPipelineNotice(null), 3000)
                    }}
                  >
                    ADVANCE STAGE // 推进阶段
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

              {pipelineNotice && (
                <AkNotice title="PIPELINE STATUS" code="SUCCESS" style={{ marginTop: '1rem' }}>
                  {pipelineNotice}
                </AkNotice>
              )}
            </AkCardContent>
          </AkCard>

          {/* 流水线参数调优与日志 */}
          <div className="demo-telemetry__body-grid">
            {/* 左侧：流水线策略配置面板 */}
            <AkCard as="div" variant="outline">
              <AkCardHeader>
                <AkCardTitle>DEPLOYMENT POLICY // 部署策略参数</AkCardTitle>
                <AkCardDescription>Real-time controllable parameters for the active runner</AkCardDescription>
              </AkCardHeader>
              <AkCardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <AkField hint="Maximum parallel runner instances allowed">
                    <AkFieldLabel htmlFor="concurrency">MAX CONCURRENCY THREADS</AkFieldLabel>
                    <AkInputNumber
                      id="concurrency"
                      value={pipelineConcurrency}
                      min={1}
                      max={32}
                      label="Threads"
                      onValueChange={setPipelineConcurrency}
                    />
                  </AkField>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <AkChoice
                      variant="switch"
                      checked={autoRollback}
                      onChange={(e) => setAutoRollback(e.target.checked)}
                    >
                      AUTOMATIC ROLLBACK ON P99 SPIKE
                    </AkChoice>

                    <AkChoice
                      variant="switch"
                      checked={twoFactorEnforce}
                      onChange={(e) => setTwoFactorEnforce(e.target.checked)}
                    >
                      ENFORCE 2FA OPERATOR SIGN-OFF
                    </AkChoice>
                  </div>
                </div>
              </AkCardContent>
            </AkCard>

            {/* 右侧：实时日志堆栈 */}
            <AkCard as="div" variant="chassis">
              <AkCardHeader>
                <AkCardTitle>ACTIVE LOG STACK // 阶段日志堆栈</AkCardTitle>
                <AkCardDescription>Live telemetry stream from worker sandboxes</AkCardDescription>
              </AkCardHeader>
              <AkCardContent>
                <AkNoticeStack>
                  <AkNotice title="ARTIFACT COMPILATION COMPLETE" code="STAMP_OK">
                    Built image `registry.rhodes.internal/ak-ui-prod:2.4.0` in 41.2s. Output size: 28.4 MB.
                  </AkNotice>
                  <AkNotice variant="warning" title="HIGH DISK IO DETECTED ON LAYER CACHE" code="IO_WARN">
                    Build agent disk IOPS reached 4,200. Consider provisioning additional SSD scratch volumes.
                  </AkNotice>
                  <AkNotice variant="success" title="0 CRITICAL CVEs DETECTED" code="SECURITY_PASSED">
                    Cross-referenced against NVD & GitHub Advisory Database (3,841 dependencies analyzed).
                  </AkNotice>
                </AkNoticeStack>
              </AkCardContent>
            </AkCard>
          </div>

          {/* 熔断确认弹窗 */}
          <AkDialog
            open={rollbackDialogOpen}
            onOpenChange={setRollbackDialogOpen}
            eyebrow="SAFETY INTERLOCK // CIRCUIT BREAKER"
            title="IMMEDIATELY ABORT & ROLLBACK PROD PIPELINE?"
            footer={
              <>
                <AkButton variant="outline" size="sm" onClick={() => setRollbackDialogOpen(false)}>
                  RESUME // 继续流水线
                </AkButton>
                <AkButton
                  variant="danger"
                  chamfer
                  size="sm"
                  onClick={() => {
                    playTactileSound('confirm', 0.25)
                    setRollbackDialogOpen(false)
                    setPipelineStep(0)
                    setPipelineNotice('CIRCUIT BREAKER TRIGGERED: Rollback initiated. Cluster restored to v2.3.9.')
                  }}
                >
                  CONFIRM CIRCUIT BREAK // 确认紧急熔断
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
              {/* 过滤与检索工具栏 */}
              <div className="demo-audit__toolbar">
                <AkInput
                  placeholder="Filter by operator, IP, or action keyword..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  style={{ maxWidth: '24rem' }}
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
                      ip: ev.ip,
                      action: ev.action,
                    },
                    selected: inspectAudit?.id === ev.id,
                  }))}
                  onRowClick={(row) => {
                    const found = AUDIT_EVENTS.find((e) => e.id === row.id)
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
                <AkButton variant="action" size="sm" onClick={() => setInspectAudit(null)}>
                  CLOSE // 关闭
                </AkButton>
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
                    {`{\n  "event_id": "${inspectAudit.id}",\n  "trace_id": "tr-7f9a8820c4",\n  "auth_method": "mTLS + RBAC v2",\n  "enforced_policy": "ZeroTrust_Level_4",\n  "result": "PERMITTED"\n}`}
                  </code>
                </div>
              </div>
            </AkDialog>
          )}
        </div>
      )}
    </div>
  )
}

function getCodeSnippet(scenario: ScenarioId): string {
  switch (scenario) {
    case 'cluster':
      return `import { AkCard, AkTable, AkStatus, AkProgress, AkGauge, AkButton, AkDialog } from '@swufefox/ak-ui-react'

export function ClusterStation() {
  const [selectedNode, setSelectedNode] = useState('node-alpha-01')
  const [drainOpen, setDrainOpen] = useState(false)

  return (
    <div className="telemetry-grid">
      {/* 1. Global Metrics */}
      <AkCard variant="glass" chamfer>
        <AkProgress value={68} label="CORE USAGE (128 vCPUs)" />
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
      return `import { AkCard, AkNoticeStack, AkNotice, AkInputNumber, AkChoice, AkButton, AkDialog } from '@swufefox/ak-ui-react'

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
  }
}
