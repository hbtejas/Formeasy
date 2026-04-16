import * as React from "react";
import { cn } from "@/utils/cn";

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-xl border border-slate-200 bg-white shadow-soft", className)} {...props} />
);
