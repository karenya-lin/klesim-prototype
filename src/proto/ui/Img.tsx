import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt?: string;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
};

/** Static, pre-optimised asset from /public (SVG icons, small WebP photos). */
export function Img({ src, alt = "", size, width, height, className, style, eager }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width ?? size}
      height={height ?? size}
      className={className}
      style={style}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );
}
