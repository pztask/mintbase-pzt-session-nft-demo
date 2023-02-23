import React, { ReactElement, ReactNode } from "react";
import Link from "next/link";

interface LinkWDisableProps {
  enabledHref: string;
  enabledClassName: string;
  disabledClassName: string;
  disabled: boolean;
  children: ReactNode | ReactElement;
}

export default function LinkWDisable({
  enabledHref,
  enabledClassName,
  disabledClassName,
  disabled,
  children,
}: LinkWDisableProps) {
  const href = disabled ? "" : enabledHref;
  const className = disabled ? disabledClassName : enabledClassName;

  return (
    <Link
      href={href}
      className={className}
      style={{ pointerEvents: disabled ? "none" : "auto" }}
    >
      {children}
    </Link>
  );
}
