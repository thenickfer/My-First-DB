import { PrismaClient } from "@prisma/client";
import { z } from "zod";

export { createUser, prisma };

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
    email = email.trim();
    if ((await prisma.user.findMany({ where: { OR: [{ email: email }, { name: name }] } })) == null) {
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
    } else {
        console.log("User already exists");
    }
}






