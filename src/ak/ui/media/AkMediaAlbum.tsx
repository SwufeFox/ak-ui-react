import type { HTMLAttributes } from 'react'
import { cx } from '../../lib/utils'

/**
 * 拍立得相册 / 图层媒体。
 *
 * `_ak-media.scss` 134 行、两代结构，一个 React 组件都没有。这里按样式表原样接出来。
 *
 * ⚠️ 两代结构的区别（照样式表，不是照直觉）：
 *   · **旧版（默认）**：底片与白边都是根元素的伪元素画的
 *     （`::before` = 歪斜的底片、`::after` = 前景白边）。**没有子元素**。
 *     底片是**纯色**（`--ak-media-album-bgcolor`），不是图 —— 所以 `backSrc` 在这代里无处可用。
 *   · **新版（`--layered`）**：伪元素被 `content: none` 关掉，改用真实子元素
 *     `.ak-media__sheet--front` / `--back`。前片扛布局、后片绝对定位垫在后面，
 *     两张各有独立的动画时间线（`--split-enter`）。
 *
 * ⚠️ 入场动画的互斥：`--enter` 是「整册一起入场」，`--split-enter` 是「两片各自入场」。
 * 样式表里 `--split-enter` 会把根元素 `animation` 置为 none（优先级高于 `--enter`），
 * 但两者同时挂上会先跑一轮再被覆盖，所以这里在组件层就做成互斥：
 * `splitEnter` 隐含 `layered`，并且不再输出 `--enter`。
 */

export interface AkMediaAlbumProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 前景图。 */
  src: string
  /** 前景图的 alt。**默认空串（当装饰）** —— 有信息量的图请显式传。 */
  alt?: string
  /**
   * 底片图。**只在 `layered` 下有效**：旧版的底片是伪元素画的纯色块，塞不进图。
   */
  backSrc?: string
  /** 底片图的 alt，默认空串（底片通常纯装饰）。 */
  backAlt?: string
  /** 启用真实双片结构（`.ak-media--layered`），才能分别给前后片上图。 */
  layered?: boolean
  /** 整册入场动画（`.ak-media--enter`）。与 `splitEnter` 互斥。 */
  enter?: boolean
  /** 分层入场：两片各走独立时间线（`.ak-media--split-enter`）。隐含 `layered`。 */
  splitEnter?: boolean
}

/**
 * 相册组件。默认是单图 + 伪元素底片；给 `layered` 才变成可分别控图的双片结构。
 *
 * ```tsx
 * <AkMediaAlbum src="/cover.jpg" alt="封面" />
 * <AkMediaAlbum src="/cover.jpg" alt="封面" backSrc="/back.jpg" layered splitEnter />
 * ```
 */
export function AkMediaAlbum({
  src,
  alt = '',
  backSrc,
  backAlt = '',
  layered = false,
  enter = false,
  splitEnter = false,
  className,
  ...rest
}: AkMediaAlbumProps) {
  // splitEnter 只能跑在 layered 上：它的选择器是
  // `.ak-media--album.ak-media--layered.ak-media--split-enter`，缺 layered 整条不生效
  const isLayered = layered || splitEnter

  return (
    <div
      {...rest}
      className={cx(
        'ak-media',
        'ak-media--album',
        // 互斥：分层入场时不再输出整册入场，否则两个 animation 会叠加
        enter && !splitEnter && 'ak-media--enter',
        isLayered && 'ak-media--layered',
        splitEnter && 'ak-media--split-enter',
        className,
      )}
      data-slot="ak-media-album"
      data-layered={isLayered ? 'true' : undefined}
    >
      {isLayered ? (
        <>
          <span className="ak-media__sheet ak-media__sheet--front">
            <img src={src} alt={alt} />
          </span>
          {backSrc ? (
            <span className="ak-media__sheet ak-media__sheet--back" aria-hidden="true">
              <img src={backSrc} alt={backAlt} />
            </span>
          ) : null}
        </>
      ) : (
        <img src={src} alt={alt} />
      )}
    </div>
  )
}
