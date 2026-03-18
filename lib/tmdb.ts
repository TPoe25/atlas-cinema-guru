const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getHeaders(): HeadersInit {
  const token = process.env.TMDB_API_TOKEN;

  if (!token) {
    throw new Error("TMDB_API_TOKEN is not configured");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json;charset=utf-8",
  };
}

async function tmdbFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url.toString(), {
    headers: getHeaders(),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    let message = "TMDB request failed";

    try {
      const payload = await response.json();
      message = payload.status_message ?? message;
    } catch {
      // ignore JSON parse failure
    }

    throw new Error(message);
  }

  return response.json();
}

export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids?: number[];
};

export type TmdbGenre = {
  id: number;
  name: string;
};

type SearchMoviesResponse = {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbMovie[];
};

type GenresResponse = {
  genres: TmdbGenre[];
};

export async function getMovieGenres() {
  return tmdbFetch<GenresResponse>("/genre/movie/list", {
    language: "en-US",
  });
}

export async function searchMovies(params: {
  page?: number;
  query?: string;
  minYear?: number;
  maxYear?: number;
  genreIds?: number[];
}) {
  const { page = 1, query = "", minYear, maxYear, genreIds = [] } = params;

  if (query.trim()) {
    const data = await tmdbFetch<SearchMoviesResponse>("/search/movie", {
      query,
      page,
      include_adult: "false",
      language: "en-US",
    });

    let filtered = data.results;

    if (minYear) {
      filtered = filtered.filter((movie) => {
        const year = movie.release_date ? Number(movie.release_date.slice(0, 4)) : null;
        return year ? year >= minYear : false;
      });
    }

    if (maxYear) {
      filtered = filtered.filter((movie) => {
        const year = movie.release_date ? Number(movie.release_date.slice(0, 4)) : null;
        return year ? year <= maxYear : false;
      });
    }

    if (genreIds.length > 0) {
      filtered = filtered.filter((movie) =>
        genreIds.every((genreId) => movie.genre_ids?.includes(genreId))
      );
    }

    return {
      page,
      total_pages: data.total_pages,
      total_results: filtered.length,
      results: filtered,
    };
  }

  return tmdbFetch<SearchMoviesResponse>("/discover/movie", {
    page,
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    sort_by: "popularity.desc",
    with_genres: genreIds.length ? genreIds.join(",") : undefined,
    "primary_release_date.gte": minYear ? `${minYear}-01-01` : undefined,
    "primary_release_date.lte": maxYear ? `${maxYear}-12-31` : undefined,
  });
}
