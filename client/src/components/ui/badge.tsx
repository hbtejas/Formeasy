import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const Badge = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
      className
    )}
    {...props}
  />
);
