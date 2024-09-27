import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createUser, prisma, getUsers, getMovies } from "./index";


async function main() {

    createUser("CleitonMalandro", "cleiton@roubacartao.com", "12345");


}

const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log("listening on port 3000")
})
//handling get requests
app.get("/user", async (req: any, res: any) => {
    const users = await getUsers();
    try {
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: "couldn't fetch" })
    }


})

app.get("/movie", async (req: any, res: any) => {
    const movies = await getMovies();
    try {
        res.status(200).json(movies)
    } catch (error) {
        res.status(500).json({ error: "couldn't fetch" })
    }
})


//handling post requests

app.post("/user", async (req: any, res: any,) => {
    const user = req.body;

    await prisma.user.create(user);

})

main()
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });