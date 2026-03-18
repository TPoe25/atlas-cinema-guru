import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getWatchLaterTitles } from "@/lib/data";
import MovieGrid from "@/components/movies/MovieGrid";
import PaginationControls from "@/components/movies/PaginationControls";

type WatchLaterPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function WatchLaterPage({
  searchParams,
}: WatchLaterPageProps) {
  const session = await getServerSession(authOptions);
  const params = (await searchParams) ?? {};
  const page = Number(params.page ?? "1");

  const result = await getWatchLaterTitles(session!.user.id, page);

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Watch Later</h2>
        <p className="mt-2 text-slate-400">
          Movies you saved to come back to later.
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
