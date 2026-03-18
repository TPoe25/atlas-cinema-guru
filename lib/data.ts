import { prisma } from "@/lib/prisma";
import { getMovieGenres, searchMovies } from "@/lib/tmdb";

const PAGE_SIZE = 20;

export async function getAvailableGenres() {
    const data = await getMovieGenres();

    return data.genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
    }));
}

export async function getTitles(params: {
    page?: number;
    search?: string;
    minYear?: number;
    maxYear?: number;
    genres?: string[];
    userId?: string;
}) {
    const { page = 1, search = "", minYear, maxYear, genres = [], userId } = params;

    const allGenres = await getMovieGenres();
    const genreMap = new Map(allGenres.genres.map((genre) => [genre.name, genre.id]));
    const genreNameMap = new Map(allGenres.genres.map((genre) => [genre.id, genre.name]));

    const genreIds = genres
        .map((genreName) => genreMap.get(genreName))
        .filter((id): id is number => typeof id === "number");

    const data = await searchMovies({
        page,
        query: search,
        minYear,
        maxYear,
        genreIds,
    });

    const tmdbIds = data.results.map((movie) => movie.id);

    const [favorites, watchLater] = userId
        ? await Promise.all([
            prisma.favorite.findMany({
                where: {
                    userId,
                    titleId: { in: tmdbIds },
                },
                select: { titleId: true },
            }),
            prisma.watchLater.findMany({
                where: {
                    userId,
                    titleId: { in: tmdbIds },
                },
                select: { titleId: true },
            }),
        ])
        : [[], []];

    const favoriteIds = new Set(favorites.map((item) => item.titleId));
    const watchLaterIds = new Set(watchLater.map((item) => item.titleId));

    const titles = data.results.map((movie) => ({
        id: movie.id,
        name: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        releaseDate: movie.release_date || null,
        year: movie.release_date ? Number(movie.release_date.slice(0, 4)) : null,
        genres: (movie.genre_ids ?? [])
            .map((genreId) => genreNameMap.get(genreId))
            .filter((name): name is string => Boolean(name)),
        mediaType: "movie",
        isFavorited: favoriteIds.has(movie.id),
        isInWatchLater: watchLaterIds.has(movie.id),
    }));

    return {
        titles,
        totalCount: data.total_results,
        totalPages: data.total_pages,
        currentPage: data.page,
    };
}

export async function getFavoriteTitles(userId: string, page = 1) {
    const [favorites, totalCount] = await Promise.all([
        prisma.favorite.findMany({
            where: { userId },
            include: {
                title: {
                    include: {
                        favorites: {
                            where: { userId },
                            select: { id: true },
                        },
                        watchLater: {
                            where: { userId },
                            select: { id: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        prisma.favorite.count({
            where: { userId },
        }),
    ]);

    const titles = favorites.map(({ title }) => ({
        id: title.id,
        name: title.name,
        overview: title.overview,
        posterPath: title.posterPath,
        backdropPath: title.backdropPath,
        releaseDate: title.releaseDate ? title.releaseDate.toISOString() : null,
        year: title.year,
        genres: title.genres,
        mediaType: title.mediaType,
        isFavorited: title.favorites.length > 0,
        isInWatchLater: title.watchLater.length > 0,
    }));

    return {
        titles,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
        currentPage: page,
    };
}

export async function getWatchLaterTitles(userId: string, page = 1) {
    const [watchLaterItems, totalCount] = await Promise.all([
        prisma.watchLater.findMany({
            where: { userId },
            include: {
                title: {
                    include: {
                        favorites: {
                            where: { userId },
                            select: { id: true },
                        },
                        watchLater: {
                            where: { userId },
                            select: { id: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        prisma.watchLater.count({
            where: { userId },
        }),
    ]);

    const titles = watchLaterItems.map(({ title }) => ({
        id: title.id,
        name: title.name,
        overview: title.overview,
        posterPath: title.posterPath,
        backdropPath: title.backdropPath,
        releaseDate: title.releaseDate ? title.releaseDate.toISOString() : null,
        year: title.year,
        genres: title.genres,
        mediaType: title.mediaType,
        isFavorited: title.favorites.length > 0,
        isInWatchLater: title.watchLater.length > 0,
    }));

    return {
        titles,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
        currentPage: page,
    };
}

export async function getRecentActivities(userId: string) {
    return prisma.activity.findMany({
        where: { userId },
        include: {
            title: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
    });
}
