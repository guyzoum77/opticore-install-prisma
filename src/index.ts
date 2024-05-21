#!/usr/bin/env node

import clackCLI from "@clack/prompts";
import colors from "ansi-colors";
import {promisify} from "util";
import cp from "child_process";
import fs from "fs";

export async function initializePrismaFunction(projectName: string, provider: string | any, projectPath: any): Promise<void> {
    let ora = (await import("ora")).default;
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
        fs.rmSync(projectPath, { recursive: true, force: true });
        process.exit(0);
    }

    if (installPrismaORM[0] === "prisma_orm") {
        const prismaORMSpinner = ora("Prisma ORM installation and configuration").start();
        await asyncExec("npm install prisma --save-dev @prisma/client").then(async () => {
            try {
                await asyncExec(`npx prisma init --datasource-provider ${provider}`, { cwd: projectName });
            } catch (error: any) {
                console.error("Error executing command:", error.message);
                fs.rmSync(projectPath, { recursive: true, force: true });
            }
        });
        prismaORMSpinner.succeed();

    } else {
        console.log(colors.bgCyan(`${colors.white(`You did not choose prisma as your ORM.`)}`));
    }
}