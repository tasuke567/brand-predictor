// src/components/Button.tsx
import clsx from "clsx";
import "@/styles/Button.css"; // 👈 import CSS ที่สร้างไว้

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

export function Button({
  variant = "solid",
  size = "md",
  fullWidth,
  className,
  ...rest
}: Props) {
  return (
    <button
      className={clsx(
        "btn",
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && "btn--full",
        className
      )}
      {...rest}
    />
  );
}
