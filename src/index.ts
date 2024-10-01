import { PrismaClient } from "@prisma/client";
import { z } from "zod";

export { createUser, createMovie, prisma, getUsers, getMovies, deleteUser, deleteMovie, updateUserName, updateMovieSyn };

const prisma = new PrismaClient();

const UserSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(3, "Password is too short"),
});

type User = z.infer<typeof UserSchema>;

const MovieSchema = z.object({
    title: z.string().min(2, "Title is too short"),
    synopsis: z.string().min(2, "Synopsis is too short"),
    director: z.string().min(2, "Director name is too short"),
});

type Movie = z.infer<typeof MovieSchema>;

const reviewSchema = z.object({
    comment: z.string().min(1, "Comment is too short"),
    rating: z.number().int().lte(5).nonnegative(),

});

type Review = z.infer<typeof MovieSchema>;


async function createUser(name: any, email: any, pass: any) {
    email = email.trim().toLowerCase();
    if ((await prisma.user.findFirst({ where: { OR: [{ email: email }, { name: { equals: name, mode: "insensitive" } }] } })) == null) {
        const newUser = {
            name: name,
            email: email,
            password: pass
        };
        const parsed = UserSchema.safeParse(newUser);
        if (parsed.success) {
            await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: pass,
                }

            });
        }
        return true;
    } else {
        console.log("User already exists");
        return false;
    }
}


async function getUsers() {
    const users = await prisma.user.findMany();
    return users;
}

async function deleteUser(email: any, pass: any) {
    if (await prisma.user.findFirst({ where: { AND: [{ email: email }, { password: pass }] } }) != null) {
        await prisma.user.delete({ where: { email: email } });
        return true
    } else {
        return false;
    }
}

async function updateUserName(email: any, pass: any, name: any) {
    email = email.trim().toLowerCase();
    if ((await prisma.user.findFirst({ where: { AND: [{ email: email }, { password: pass }] } })) != null) {
        const newUser = {
            name: name,
            email: email,
            password: pass
        };
        const parsed = UserSchema.safeParse(newUser);
        if (parsed.success) {
            await prisma.user.update({
                where: { email: email },
                data: { name: name }
            });
            return true;
        }
        return false;
    }
    return false;
}

async function createMovie(title: any, synopsis: any, director: any) {
    if ((await prisma.movie.findFirst({ where: { title: title } })) == null) {
        const newMovie = {
            title: title,
            synopsis: synopsis,
            director: director
        };
        const parsed = MovieSchema.safeParse(newMovie);
        if (parsed.success) {
            await prisma.movie.create({
                data: {
                    title: title,
                    synopsis: synopsis,
                    director: director
                }

            });
        }
        return true;
    } else {
        console.log("Movie already exists");
        return false
    }
}

async function getMovies() {
    const movies = await prisma.movie.findMany({ include: { reviews: true } });
    console.dir(movies, { depth: null })
    return movies;
}

async function deleteMovie(title: any) {
    console.dir(prisma.movie.findFirst({ where: { title: title } }), { depth: null });
    if (await prisma.movie.findFirst({ where: { title: title } }) != null) {
        await prisma.movie.delete({ where: { title: title } });
        return true;
    } else {
        return false;
    }
}

async function updateMovieSyn(title: any, syn: any) {
    if (await prisma.movie.findFirst({ where: { title: title } }) != null) {
        await prisma.movie.update({ where: { title: title }, data: { synopsis: syn } });
        return true;
    }
    return false;
}
