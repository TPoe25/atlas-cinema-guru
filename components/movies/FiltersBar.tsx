"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Genre = {
    id: number;
    name: string;
};

type FiltersBarProps = {
    genres: Genre[];
};

export default function FiltersBar({ genres }: FiltersBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const [minYear, setMinYear] = useState(searchParams.get("minYear") ?? "");
    const [maxYear, setMaxYear] = useState(searchParams.get("maxYear") ?? "");
    const selectedGenres = searchParams.getAll("genres");

    function toggleGenre(genreName: string) {
        const params = new URLSearchParams(searchParams.toString());
        const existingGenres = params.getAll("genres");

        params.delete("genres");

        if (existingGenres.includes(genreName)) {
            existingGenres
                .filter((item) => item !== genreName)
                .forEach((item) => params.append("genres", item));
        } else {
            [...existingGenres, genreName].forEach((item) =>
                params.append("genres", item)
            );
        }

        params.set("page", "1");
        router.push(`/?${params.toString()}`);
    }

    function applyFilters() {
        const params = new URLSearchParams(searchParams.toString());

        if (search) params.set("search", search);
        else params.delete("search");

        if (minYear) params.set("minYear", minYear);
        else params.delete("minYear");

        if (maxYear) params.set("maxYear", maxYear);
        else params.delete("maxYear");

        params.set("page", "1");
        router.push(`/?${params.toString()}`);
    }

    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="grid gap-4 md:grid-cols-3">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title"
                    className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                />

                <input
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    placeholder="Min year"
                    className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                />

                <input
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                    placeholder="Max year"
                    className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none"
                />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {genres.map((genre) => {
                    const isSelected = selectedGenres.includes(genre.name);

                    return (
                        <button
                            key={genre.id}
                            type="button"
                            onClick={() => toggleGenre(genre.name)}
                            className={`rounded-full px-4 py-2 text-sm transition ${isSelected
                                    ? "bg-violet-600 text-white"
                                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                }`}
                        >
                            {genre.name}
                        </button>
                    );
                })}
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    onClick={applyFilters}
                    className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
