import type { HTMLAttributes } from "react";

export function GradientText({
  children,
  className = "",
  as: Tag = "span",
  ...rest
}: HTMLAttributes<HTMLElement> & { as?: "span" | "h1" | "h2" | "p" }) {
  return (
    <Tag
      className={`bg-gradient-to-r from-[#D6BCFA] via-[#B794F4] to-white bg-clip-text text-transparent ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
