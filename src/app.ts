import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createUser, prisma } from "./index";


async function main() {

    createUser("NelsonMalandro", "nelson@roubacartao.com", "12345");


}

main()
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });