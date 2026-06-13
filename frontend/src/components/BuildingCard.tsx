import Link from "next/link";
import { genderLabel } from "@/lib/api";
import type { Building } from "@/types";

interface BuildingCardProps {
  building: Building;
  reviewCount?: number;
  avgRating?: number | null;
}

export default function BuildingCard({
  building,
  reviewCount = 0,
  avgRating,
}: BuildingCardProps) {
  return (
    <Link
      href={`/buildings/${building.id}`}
      className="group block rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-indigo-500/50 hover:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white group-hover:text-indigo-300">
            {building.name}
          </h3>
          {building.address && (
            <p className="mt-1 text-sm text-slate-400">{building.address}</p>
          )}
        </div>
        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
          {genderLabel(building.gender)}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3 text-sm text-slate-500">
        <span>{reviewCount} review{reviewCount !== 1 ? "s" : ""}</span>
        {avgRating !== null && avgRating !== undefined && (
          <span className="text-amber-400">★ {avgRating}</span>
        )}
      </div>

      {building.facilities && (
        <p className="mt-2 line-clamp-1 text-xs text-slate-600">
          {building.facilities}
        </p>
      )}
    </Link>
  );
}
