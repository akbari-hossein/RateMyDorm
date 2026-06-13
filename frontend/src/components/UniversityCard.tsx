import Link from "next/link";
import type { University } from "@/types";

interface UniversityCardProps {
  university: University;
}

export default function UniversityCard({ university }: UniversityCardProps) {
  return (
    <Link
      href={`/universities/${university.id}`}
      className="group block rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-indigo-500/50 hover:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white group-hover:text-indigo-300">
            {university.name}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {university.city}, {university.country}
          </p>
        </div>
        <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300">
          View dorms
        </span>
      </div>
      {university.description && (
        <p className="mt-3 line-clamp-2 text-sm text-slate-500">
          {university.description}
        </p>
      )}
    </Link>
  );
}
