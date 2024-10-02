import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
    createUser, createMovie, prisma, getUsers, getMovies, deleteUser, deleteMovie, updateUserName, updateMovieSyn,
    getMovieReviews, getUserReviews, postReview
} from "./index";


async function main() {

    createUser("CleitonMalandro", "cleiton@roubacartao.com", "12345");


}

const express = require('express');
const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log("listening on port 3000")
})
//handling get requests
app.get("/user/all", async (req: any, res: any) => {
    const users = await getUsers();
    try {
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: "couldn't fetch" })
    }


})

app.get("/movie/all", async (req: any, res: any) => {
    const movies = await getMovies();
    try {
        res.status(200).json(movies)
    } catch (error) {
        res.status(500).json({ error: "couldn't fetch" })
    }
})

app.get("/reviews/:user", async (req: any, res: any) => {
    const name = req.params.user;
    const usersR = await getUserReviews(name);
    try {
        res.status(200).json(usersR)
    } catch (error) {
        res.status(500).json({ error: "couldn't fetch" })
    }


})

app.get("/movie/reviews/:movie", async (req: any, res: any) => {
    let name = req.params.movie;
    name = name.replace("+", " ");
    console.log(name);
    const movieR = await getMovieReviews(name);
    try {
        res.status(200).json(movieR)
    } catch (error) {
        res.status(500).json({ error: "couldn't fetch" })
    }


})

//handling post requests

app.post("/user", async (req: any, res: any,) => {
    const usr = req.body;
    console.dir(usr, { depth: null })

    if (await createUser(usr.data.name, usr.data.email, usr.data.password)) {
        try {
            res.status(201).json(usr);
        } catch (error) {
            res.status(500).json({ error: "couldn't post" });
        }
    } else {
        res.status(500).json({ error: "user already exists" });
    }
})

app.post("/movie", async (req: any, res: any,) => {
    const mov = req.body;
    console.dir(mov, { depth: null })

    if (await createMovie(mov.data.title, mov.data.synopsis, mov.data.director)) {
        try {
            res.status(201).json(mov);
        } catch (error) {
            res.status(500).json({ error: "couldn't post" });
        }
    } else {
        res.status(500).json({ error: "movie already exists" });
    }
})

app.post("/movie/reviews/:movie", async (req: any, res: any) => {
    let name = req.params.movie;
    name = name.replace("+", " ");
    const review = req.body;

    if (await postReview(review.authorName, name, review.comment, review.rating)) {
        res.status(200).json(review)
    } else {
        res.status(500).json({ error: "couldn't post" })
    }


})

//handling delete requests

app.delete("/user/delete", async (req: any, res: any) => {
    const usr = req.body;

    if (await deleteUser(usr.data.email, usr.data.password)) {
        res.status(200).json(usr);
    } else {
        res.status(500).json({ error: "inexistent user" });
    }

})

app.delete("/movie/delete/:title", async (req: any, res: any) => {

    if (await deleteMovie(req.params.title)) {
        res.status(200).json({ success: "movie deleted" });
    } else {
        res.status(500).json({ error: "inexistent movie" });
    }
});


//handling update requests

app.patch("/user/patch/", async (req: any, res: any) => {
    const upd = req.body;

    if (await updateUserName(upd.data.email, upd.data.password, upd.data.name)) {
        res.status(200).json(upd);
    } else {
        res.status(500).json({ error: "failed to find user or incompatible data types" });
    }
})

app.patch("/movie/patch", async (req: any, res: any) => {
    const upd = req.body;

    if (await updateMovieSyn(upd.data.title, upd.data.synopsis)) {
        res.status(200).json(upd);
    } else {
        res.status(500).json({ error: "failed to find movie" });
    }
})

main()
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });