#!/usr/bin/env node

import clackCLI from "@clack/prompts";
import colors from "ansi-colors";
import {promisify} from "util";
import cp from "child_process";

export async function initializePrismaFunction(projectName: string, provider: string | any) {
    const asyncExec = promisify(cp.exec);

    const installPrismaORM =  await clackCLI.select({
        message: "Do you want install Prisma ORM ?",
        initialValue: ["prisma_orm"],
        options: [
            {label: "Yes, i want to install Prisma ORM.", value: ["prisma_orm"]},
            {label: "No, i don't want it.", value: ['no_prisma_orm']},
        ],
    });

    if (clackCLI.isCancel(installPrismaORM)) {
        console.log(`${colors.bgRed(`${colors.white("Operation cancelled.")}`)}`);
        process.exit(0);
    }

    if (installPrismaORM[0] === "prisma_orm") {
        await asyncExec("npm install prisma --save-dev @prisma/client").then(async () => {
            try {
                await asyncExec(`npx prisma init --datasource-provider ${provider}`, { cwd: projectName });
            } catch (error) {
                console.error("Error executing command:", error);
            }
        });

    } else {
        console.log(colors.bgCyan(`${colors.white(`You did not choose prisma as your ORM.`)}`));
    }
}