import { ActiveLink } from "@/components/active-link";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex px-6 h-14 shrink-0 items-center justify-between border-b">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-heading">
            agentc.directory
          </Link>
          <ActiveLink href="/" className="text-sm">
            Agents
          </ActiveLink>
          <ActiveLink href="/tools" className="text-sm">
            Tools
          </ActiveLink>
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <ThemeToggle />
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
