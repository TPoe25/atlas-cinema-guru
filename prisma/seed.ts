import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const titles = [
        {
            id: 11,
            name: "Dune",
            overview:
                "Paul Atreides leads nomadic tribes in a battle to control the desert planet Arrakis.",
            posterPath: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
            backdropPath: "/iopYFB1b6Bh7FWZh3onQhph1sih.jpg",
            releaseDate: new Date("2021-10-22"),
            year: 2021,
            genres: ["Sci-Fi", "Adventure", "Drama"],
            mediaType: "movie",
        },
        {
            id: 12,
            name: "Interstellar",
            overview:
                "A team travels through a wormhole in space in an attempt to ensure humanity's survival.",
            posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            backdropPath: "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
            releaseDate: new Date("2014-11-07"),
            year: 2014,
            genres: ["Sci-Fi", "Adventure", "Drama"],
            mediaType: "movie",
        },
        {
            id: 13,
            name: "Arrival",
            overview:
                "A linguist works with the military to communicate with alien lifeforms after mysterious spacecraft appear.",
            posterPath: "/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
            backdropPath: "/yIZ1xendyqKvY3FGeeUYUd5X9Mm.jpg",
            releaseDate: new Date("2016-11-11"),
            year: 2016,
            genres: ["Sci-Fi", "Mystery", "Drama"],
            mediaType: "movie",
        },
        {
            id: 14,
            name: "The Batman",
            overview:
                "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of clues.",
            posterPath: "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
            backdropPath: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
            releaseDate: new Date("2022-03-04"),
            year: 2022,
            genres: ["Action", "Crime", "Mystery"],
            mediaType: "movie",
        },
        {
            id: 15,
            name: "Blade Runner 2049",
            overview:
                "A young blade runner discovers a long-buried secret that leads him to track down former blade runner Rick Deckard.",
            posterPath: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
            backdropPath: "/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg",
            releaseDate: new Date("2017-10-06"),
            year: 2017,
            genres: ["Sci-Fi", "Thriller", "Mystery"],
            mediaType: "movie",
        },
        {
            id: 16,
            name: "Everything Everywhere All at Once",
            overview:
                "An unlikely hero must channel her new powers to fight bizarre multiverse dangers.",
            posterPath: "/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
            backdropPath: "/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg",
            releaseDate: new Date("2022-03-25"),
            year: 2022,
            genres: ["Sci-Fi", "Comedy", "Adventure"],
            mediaType: "movie",
        },
    ];

    for (const title of titles) {
        await prisma.title.upsert({
            where: { id: title.id },
            update: title,
            create: title,
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
