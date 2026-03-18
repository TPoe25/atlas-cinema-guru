"use client";

import { useTransition } from "react";
import { toggleFavorite, toggleWatchLater } from "@/app/(protected)/actions";

type MovieSnapshot = {
    id: number;
    name: string;
    overview: string;
    posterPath: string | null;
    backdropPath?: string | null;
    releaseDate?: string | null;
    year?: number | null;
    genres: string[];
    mediaType?: string | null;
};

type MovieActionsProps = {
    movie: MovieSnapshot;
    isFavorited: boolean;
    isInWatchLater: boolean;
};

export default function MovieActions({
    movie,
    isFavorited,
    isInWatchLater,
}: MovieActionsProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="mt-4 flex gap-3">
            <button
                type="button"
                disabled={isPending}
                onClick={() =>
                    startTransition(async () => {
                        await toggleFavorite(movie);
                    })
                }
                className="rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/25 disabled:opacity-60"
            >
                {isFavorited ? "★ Favorited" : "☆ Favorite"}
            </button>

            <button
                type="button"
                disabled={isPending}
                onClick={() =>
                    startTransition(async () => {
                        await toggleWatchLater(movie);
                    })
                }
                className="rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/25 disabled:opacity-60"
            >
                {isInWatchLater ? "🕒 Saved" : "🕒 Watch Later"}
            </button>
        </div>
    );
}
