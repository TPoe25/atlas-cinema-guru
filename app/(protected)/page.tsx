import { getServerSession } from "next-auth";
import FiltersBar from "@/components/movies/FiltersBar";
import MovieGrid from "@/components/movies/MovieGrid";
import PaginationControls from "@/components/movies/PaginationControls";
import { getAvailableGenres, getTitles } from "@/lib/data";
import { authOptions } from "@/lib/auth";

type HomePageProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    minYear?: string;
    maxYear?: string;
    genres?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const session = await getServerSession(authOptions);
  const params = (await searchParams) ?? {};

  const page = Number(params.page ?? "1");
  const search = params.search ?? "";
  const minYear = params.minYear ? Number(params.minYear) : undefined;
  const maxYear = params.maxYear ? Number(params.maxYear) : undefined;
  const genresParam = params.genres;
  const genres = Array.isArray(genresParam)
    ? genresParam
    : genresParam
      ? [genresParam]
      : [];

  const [availableGenres, result] = await Promise.all([
    getAvailableGenres(),
    getTitles({
      page,
      search,
      minYear,
      maxYear,
      genres,
      userId: session?.user?.id,
    }),
  ]);

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Browse Movies</h2>
        <p className="mt-2 text-slate-400">
          Search titles, filter by year and genre, and save what you want to watch.
        </p>
      </div>

      <FiltersBar genres={availableGenres} />

      <div className="mt-8">
        <MovieGrid movies={result.titles} />
      </div>

      <PaginationControls
        currentPage={result.currentPage}
        totalPages={result.totalPages}
        searchParams={{
          page: params.page,
          search: params.search,
          minYear: params.minYear,
          maxYear: params.maxYear,
          genres: params.genres,
        }}
      />
    </section>
  );
}
