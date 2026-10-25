import type { HTMLAttributes, ReactNode, ThHTMLAttributes } from 'react'
import { cx } from '../../lib/utils'
import { sizeAttrs, type AkControlSize } from '../../lib/size'
import { tokenStyle, type AkTokens } from '../../lib/tokens'

/**
 * 数据表。
 *
 * ⚠️ **上游没有表格样式**（全库零 table 类），所以这一组是本库补的。
 * 补的是排布而不是新语汇 —— 每条几何都取自既有规则，见 `_ak-table.scss` 顶部注释。
 * 颜色全走令牌，所以亮/暗两套主题自动跟随。
 *
 * ⚠️ 刻意**不做虚拟滚动、不做排序逻辑**：这个组件只管结构与样式，
 * 排序/分页/筛选由宿主决定（`sort` 只用于把 `aria-sort` 反映到表头上）。
 * appica 的 DataTable 是「把组件接到 TanStack Table」的配方，不是组件本身 —— 同理。
 */

export type AkTableSortDirection = 'ascending' | 'descending' | 'none'

export interface AkTableColumn {
  /** 列键，与行数据的 key 对应。 */
  key: string
  /** 表头文字。 */
  header: ReactNode
  /** 数字列：等宽数位 + 右对齐。 */
  numeric?: boolean
  /** 该列当前排序方向；给了就把表头变成可点的排序表头。 */
  sort?: AkTableSortDirection
  /** 点表头排序时回调（配合 `sort` 使用）。 */
  onSortChange?: (key: string) => void
  /** 列宽。 */
  width?: string
}

export interface AkTableRow {
  /** 行标识，作为 React key。 */
  id: string
  /** 每列内容，按 column.key 取。 */
  cells: Record<string, ReactNode>
  /** 选中态：左缘信号色 + 淡底。 */
  selected?: boolean
  /** 失效/不可用：整行压淡。 */
  muted?: boolean
}

export interface AkTableProps extends Omit<HTMLAttributes<HTMLTableElement>, 'children'> {
  columns: AkTableColumn[]
  rows: AkTableRow[]
  /** 表尾汇总行（与 columns 对齐）。 */
  footer?: Record<string, ReactNode>
  /** 无数据时的占位文字。 */
  emptyLabel?: ReactNode
  /** 外层是否套一层横滑容器（列多时建议开）。 */
  scrollable?: boolean
  /** 尺寸档：控制单元格内边距与整表字号。 */
  size?: AkControlSize
  /** 逐实例令牌覆盖，例如 `{ '--ak-table-pad-y': '0.25rem' }`。 */
  tokens?: AkTokens
}

export function AkTable({
  columns,
  rows,
  footer,
  emptyLabel = 'No records',
  scrollable = false,
  size = 'md',
  tokens,
  className,
  style,
  ...rest
}: AkTableProps) {
  const table = (
    <table
      {...rest}
      {...sizeAttrs(size)}
      className={cx('ak-table', className)}
      style={tokenStyle(tokens, style)}
      data-slot="ak-table"
    >
      <thead className="ak-table__head">
        <tr>
          {columns.map((col) => {
            const sortable = col.sort !== undefined
            const thProps: ThHTMLAttributes<HTMLTableCellElement> & { 'aria-sort'?: AkTableSortDirection } = {
              scope: 'col',
              className: col.numeric ? 'ak-table__cell--num' : undefined,
              style: col.width ? { width: col.width } : undefined,
            }
            if (sortable) {
              thProps['aria-sort'] = col.sort
              // 只在真给了回调时才做成可点，避免「看起来能点其实没反应」的假 UI
              if (col.onSortChange) {
                thProps.onClick = () => col.onSortChange?.(col.key)
                thProps.tabIndex = 0
                thProps.onKeyDown = (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    col.onSortChange?.(col.key)
                  }
                }
              }
            }
            return <th key={col.key} {...thProps}>{col.header}</th>
          })}
        </tr>
      </thead>

      <tbody className="ak-table__body">
        {rows.length === 0 ? (
          <tr>
            <td className="ak-table__empty" colSpan={columns.length}>
              {emptyLabel}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr
              key={row.id}
              className={cx(row.selected && 'ak-table__row--selected', row.muted && 'ak-table__row--muted')}
              aria-selected={row.selected || undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className={col.numeric ? 'ak-table__cell--num' : undefined}>
                  {row.cells[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>

      {footer ? (
        <tfoot className="ak-table__foot">
          <tr>
            {columns.map((col) => (
              <td key={col.key} className={col.numeric ? 'ak-table__cell--num' : undefined}>
                {footer[col.key]}
              </td>
            ))}
          </tr>
        </tfoot>
      ) : null}
    </table>
  )

  if (!scrollable) return table
  return <div className="ak-table-scroll">{table}</div>
}
