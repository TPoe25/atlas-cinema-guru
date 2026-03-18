import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFavoriteTitles } from "@/lib/data";
import MovieGrid from "@/components/movies/MovieGrid";
import PaginationControls from "@/components/movies/PaginationControls";

type FavoritesPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function FavoritesPage({
  searchParams,
}: FavoritesPageProps) {
  const session = await getServerSession(authOptions);
  const params = (await searchParams) ?? {};
  const page = Number(params.page ?? "1");

  const result = await getFavoriteTitles(session!.user.id, page);

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Favorites</h2>
        <p className="mt-2 text-slate-400">
          Movies you have added to your favorites list.
        </p>
      </div>

      <MovieGrid movies={result.titles} />

      <PaginationControls
        currentPage={result.currentPage}
        totalPages={result.totalPages}
        searchParams={{ page: params.page }}
      />
    </section>
  );
}
