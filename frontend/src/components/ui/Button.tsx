import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
};

const styles = {
  primary: "bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-600",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400",
  ghost: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400",
};

export function Button({ children, href, variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`;

  if (href) {
    return <Link className={classes} href={href}>{children}</Link>;
  }

  return <button className={classes} {...props}>{children}</button>;
}