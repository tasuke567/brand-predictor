// src/components/Button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const button = cva(
  "inline-flex items-center justify-center gap-1 rounded-md transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500",
  {
    variants: {
      variant: {
        solid: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm hover:shadow-md",
        outline:
          "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-gray-700/40",
        ghost:
          "text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/40",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & { asChild?: false };

export function Button({ variant, size, fullWidth, className, ...rest }: Props) {
  return (
    <button
      className={clsx(button({ variant, size, fullWidth }), className)}
      {...rest}
    />
  );
}
