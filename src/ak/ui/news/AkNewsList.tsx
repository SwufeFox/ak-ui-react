import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { cx } from '../../lib/utils'

/**
 * 公告 / 新闻列表。
 *
 * `_ak-news-list.scss` 是这库少数几套**规格完整**的样式表之一（列表容器 + 行链接 +
 * 分类/标题/时间三个字段 + 空态 + 容器查询降级 + reduced-motion），却一直没有组件出口。
 * 这里按样式表的结构原样接出来，几何全部沿用现有令牌，没有新样式。
 *
 * ⚠️ 几个照样式表来的约束：
 *   · 行是三列网格，**列数由 `@container ak-news-list (min-width: 34rem)` 控制**，
 *     容器窄时自动降为单列。所以这个组件自带 `container: ak-news-list / inline-size`
 *     （样式表写在根类上），把它放进任何宽度都能自适应。
 *   · `__empty` 是**行级**样式（有 padding）。HTML 规则不允许 `<ul>` 直接放 `<p>`，
 *     所以空态渲染成 `<li class="ak-news-list__empty">` —— 类名照样生效，且文档结构合法。
 */

export interface AkNewsListItem {
  /** 分类标签（如「公告」「活动」），走 `__category`。 */
  category?: ReactNode
  /** 标题，走 `__title`。 */
  title: ReactNode
  /** 时间显示文本，走 `__time`。 */
  time?: ReactNode
  /**
   * 机器可读的时间（`<time datetime>`）。给了就按 `<time>` 渲染，
   * 方便读屏与抓取；只给 `time` 而无 `dateTime` 时退化为普通文本。
   */
  dateTime?: string
  /** 链接地址。给了就渲染 `<a>`。 */
  href?: string
  /** 点击回调。**不给 href 时**行仍可点（渲染为 `role="button"` 的 div），不会变成死的假链接。 */
  onSelect?: () => void
  /** `href` 是否新窗口打开；会自动补 `rel="noreferrer noopener"`。 */
  external?: boolean
}

export interface AkNewsListProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  /** 列表项，按顺序渲染。 */
  items: readonly AkNewsListItem[]
  /** 空态文案；`items` 为空时显示。 */
  empty?: ReactNode
  /** 列表的无障碍名。 */
  label?: string
}

/**
 * 公告列表。每行是「分类 / 标题 / 时间」三列，容器够宽时自动展开。
 *
 * ```tsx
 * <AkNewsList
 *   label="站点公告"
 *   empty="暂无公告"
 *   items={[{ category: '公告', title: '维护完成', time: '10-20', dateTime: '2026-10-20' }]}
 * />
 * ```
 */
export function AkNewsList({ items, empty, label, className, ...rest }: AkNewsListProps) {
  /** 只给了 onSelect 时，用 div 承担键盘可达性 —— 避免落到按钮的 UA 外装上。 */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, run: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      run()
    }
  }

  return (
    <ul {...rest} className={cx('ak-news-list', className)} data-slot="ak-news-list" aria-label={label}>
      {items.length === 0 ? (
        <li className="ak-news-list__empty">{empty}</li>
      ) : (
        items.map((item, index) => {
          const body = (
            <>
              {item.category ? <span className="ak-news-list__category">{item.category}</span> : null}
              <span className="ak-news-list__title">{item.title}</span>
              {item.time !== undefined ? (
                item.dateTime ? (
                  <time className="ak-news-list__time" dateTime={item.dateTime}>
                    {item.time}
                  </time>
                ) : (
                  <span className="ak-news-list__time">{item.time}</span>
                )
              ) : null}
            </>
          )

          return (
            <li key={index} className="ak-news-list__item">
              {item.href ? (
                <a
                  className="ak-news-list__link"
                  href={item.href}
                  {...(item.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  {...(item.onSelect ? { onClick: item.onSelect } : {})}
                >
                  {body}
                </a>
              ) : item.onSelect ? (
                // 可点但不可导航：div + role=button 保留键盘操作，同时不引入按钮的外装
                <div
                  className="ak-news-list__link"
                  role="button"
                  tabIndex={0}
                  onClick={item.onSelect}
                  onKeyDown={(event) => onKeyDown(event, item.onSelect as () => void)}
                >
                  {body}
                </div>
              ) : (
                // 纯展示行：不假装可点
                <div className="ak-news-list__link">{body}</div>
              )}
            </li>
          )
        })
      )}
    </ul>
  )
}
