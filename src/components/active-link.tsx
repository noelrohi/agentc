"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ActiveLink({
  className,
  children,
  href,
  ...props
}: React.ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      data-active={isActive}
      className={cn(
        "text-muted-foreground data-[active=true]:text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
