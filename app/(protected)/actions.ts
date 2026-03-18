"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActivityType } from "@prisma/client";

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

async function ensureTitle(snapshot: MovieSnapshot) {
    await prisma.title.upsert({
        where: { id: snapshot.id },
        update: {
            name: snapshot.name,
            overview: snapshot.overview,
            posterPath: snapshot.posterPath ?? null,
            backdropPath: snapshot.backdropPath ?? null,
            releaseDate: snapshot.releaseDate ? new Date(snapshot.releaseDate) : null,
            year: snapshot.year ?? null,
            genres: snapshot.genres,
            mediaType: snapshot.mediaType ?? "movie",
        },
        create: {
            id: snapshot.id,
            name: snapshot.name,
            overview: snapshot.overview,
            posterPath: snapshot.posterPath ?? null,
            backdropPath: snapshot.backdropPath ?? null,
            releaseDate: snapshot.releaseDate ? new Date(snapshot.releaseDate) : null,
            year: snapshot.year ?? null,
            genres: snapshot.genres,
            mediaType: snapshot.mediaType ?? "movie",
        },
    });
}

export async function toggleFavorite(snapshot: MovieSnapshot) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await ensureTitle(snapshot);

    const existing = await prisma.favorite.findUnique({
        where: {
            userId_titleId: {
                userId: session.user.id,
                titleId: snapshot.id,
            },
        },
    });

    if (existing) {
        await prisma.favorite.delete({
            where: {
                userId_titleId: {
                    userId: session.user.id,
                    titleId: snapshot.id,
                },
            },
        });
    } else {
        await prisma.favorite.create({
            data: {
                userId: session.user.id,
                titleId: snapshot.id,
            },
        });

        await prisma.activity.create({
            data: {
                userId: session.user.id,
                titleId: snapshot.id,
                type: ActivityType.FAVORITE,
            },
        });
    }

    revalidatePath("/");
    revalidatePath("/favorites");
    revalidatePath("/watch-later");
}

export async function toggleWatchLater(snapshot: MovieSnapshot) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await ensureTitle(snapshot);

    const existing = await prisma.watchLater.findUnique({
        where: {
            userId_titleId: {
                userId: session.user.id,
                titleId: snapshot.id,
            },
        },
    });

    if (existing) {
        await prisma.watchLater.delete({
            where: {
                userId_titleId: {
                    userId: session.user.id,
                    titleId: snapshot.id,
                },
            },
        });
    } else {
        await prisma.watchLater.create({
            data: {
                userId: session.user.id,
                titleId: snapshot.id,
            },
        });

        await prisma.activity.create({
            data: {
                userId: session.user.id,
                titleId: snapshot.id,
                type: ActivityType.WATCH_LATER,
            },
        });
    }

    revalidatePath("/");
    revalidatePath("/favorites");
    revalidatePath("/watch-later");
}

