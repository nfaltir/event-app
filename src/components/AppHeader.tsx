import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

function IconGift({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#C1272D]/10 bg-[#FBF3E7]/80 backdrop-blur dark:border-white/10 dark:bg-[#1A1113]/80">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 text-[#2A1A14] dark:text-[#EFE6D8]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C1272D] text-white shadow-sm transition-transform group-hover:scale-105 group-hover:-rotate-3">
            <IconGift className="h-5 w-5" />
          </span>
          <span className="font-(family-name:--font-display) text-lg font-semibold">
            Krypto&apos;s Secret{" "}
            <span className="text-[#C1272D] dark:text-[#E9B44C]">Santa</span>
          </span>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}