import MovieCard from "@/components/movies/MovieCard";

type Movie = {
  id: number;
  name: string;
  overview: string;
  posterPath: string | null;
  year: number | null;
  genres: string[];
  isFavorited: boolean;
  isInWatchLater: boolean;
};

type MovieGridProps = {
  movies: Movie[];
};

export default function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
        No titles matched your filters.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
