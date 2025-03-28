import { ActiveLink } from "@/components/active-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GithubIcon, Menu } from "lucide-react";
import Link from "next/link";

function SiteHeader() {
  return (
    <header className="flex px-6 h-14 shrink-0 items-center justify-between border-b">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-lg font-bold tracking-tighter">
          agentc.directory
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <ActiveLink href="/" className="text-sm">
            Agents
          </ActiveLink>
          <ActiveLink href="/tools" className="text-sm">
            Tools
          </ActiveLink>
          <ActiveLink href="/bookmarks" className="text-sm">
            Bookmarks
          </ActiveLink>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="https://github.com/noelrohi/agentc"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            target="_blank"
          >
            <GithubIcon className="size-[1.2rem]" />
          </Link>
          <ThemeToggle />
        </nav>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="size-[1.2rem]" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col justify-between">
            <div>
              <SheetHeader>
                <SheetTitle className="font-bold tracking-tighter">agentc.directory</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                <ActiveLink href="/">Agents</ActiveLink>
                <ActiveLink href="/tools">Tools</ActiveLink>
                <ActiveLink href="/bookmarks">Bookmarks</ActiveLink>
              </div>
            </div>
            <SheetFooter className="flex">
              <Link
                href="https://github.com/noelrohi/agentc"
                className={buttonVariants({ variant: "ghost", className: "gap-2" })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="size-[1.2rem]" />
                <span>GitHub</span>
              </Link>
              <ThemeToggle />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
