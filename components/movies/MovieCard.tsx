import Image from "next/image";
import MovieActions from "@/components/movies/MovieActions";

type MovieCardProps = {
    movie: {
        id: number;
        name: string;
        overview: string;
        posterPath: string | null;
        backdropPath?: string | null;
        releaseDate?: string | null;
        year: number | null;
        genres: string[];
        mediaType?: string | null;
        isFavorited: boolean;
        isInWatchLater: boolean;
    };
};

export default function MovieCard({ movie }: MovieCardProps) {
    const imageUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
        : "https://placehold.co/500x750?text=No+Image";

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-slate-900">
            <div className="relative aspect-[2/3] w-full">
                <Image
                    src={imageUrl}
                    alt={movie.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                />
            </div>

            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                <h3 className="text-lg font-bold text-white">{movie.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-200">
                    {movie.overview}
                </p>
                <p className="mt-3 text-xs text-slate-300">
                    {movie.year ?? "Unknown"} · {movie.genres.join(", ")}
                </p>

                <MovieActions
                    movie={movie}
                    isFavorited={movie.isFavorited}
                    isInWatchLater={movie.isInWatchLater}
                />
            </div>
        </div>
    );
}
