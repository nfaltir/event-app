import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function AppHeader() {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-5">
        <Link
          href="/"
          className="font-semibold text-gray-900 dark:text-white"
        >
          🎉 Event App
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}