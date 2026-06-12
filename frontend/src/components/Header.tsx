import Link from "next/link";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
}

export default function Header({
  title = "RateMyDorm",
  showBack = false,
  backHref = "/",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              href={backHref}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-slate-700"
              aria-label="Go back"
            >
              ←
            </Link>
          )}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
              RateMyDorm
            </p>
            <h1 className="text-lg font-semibold text-white">{title}</h1>
          </div>
        </div>
        <Link
          href="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-500"
          aria-label="Profile"
        >
          👤
        </Link>
      </div>
    </header>
  );
}
