#!/usr/bin/env node

import clackCLI from "@clack/prompts";
import colors from "ansi-colors";
import {promisify} from "util";
import cp from "child_process";
import fs from "fs";
import path from "path";
import {welcomeMessage} from "./utils/welcomeMessage";

export async function initializePrismaFunction(): Promise<void> {
    let ora = (await import("ora")).default;
    const asyncExec = promisify(cp.exec);

    welcomeMessage();

    const installPrismaORM: symbol | string[] =  await clackCLI.select({
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
        const providerSelected: symbol | string[] =  await clackCLI.select({
            message: 'Please specify a provider that you want and prisma will be configure it, and create schema model',
            initialValue: ['mysql'],
            options: [
                {label: 'MySQL', value: ['mysql']},
                {label: 'Mongo DB', value: ['mongo_db']},
                {label: 'Postgres', value: ['postgres']},
            ],
        });

        if (clackCLI.isCancel(providerSelected)) {
            console.error(`${colors.bgRed(`${colors.white("Operation cancelled.")}`)}`);
            process.exit(0);
        }

        if (fs.existsSync(path.join(process.cwd()) + "/prisma/schema.prisma")) {
            const prismaORMSpinner = ora("Prisma ORM installation and configuration").start();
            await asyncExec("npm install prisma --save-dev @prisma/client").then(async (): Promise<void> => {
                try {
                    await asyncExec(
                        `npx prisma init --datasource-provider ${providerSelected[0]}`,
                        { cwd: path.join(process.cwd()) }
                    );
                } catch (error: any) {
                    console.error("Error executing command:", error.message);
                    fs.rmSync(path.join(process.cwd()) + "/prisma", { recursive: true, force: true });
                }
            });
            prismaORMSpinner.succeed();

            // Modify the .env file to remove or comment out the DATABASE_URL
            const envFilePath: string = path.join(path.join(process.cwd()), '.env');
            if (fs.existsSync(envFilePath)) {
                let envContent: string = fs.readFileSync(envFilePath, 'utf8');
                envContent = envContent.replace(/^DATABASE_URL=.*$/m, '');
                fs.writeFileSync(envFilePath, envContent, 'utf8');
            }
        } else {
            console.error(`${colors.bgCyan(`${colors.white("Prisma has been already installed in your project.")}`)}`);
            process.exit(0);
        }

    } else {
        console.log(colors.bgCyan(`${colors.white(`You did not choose prisma as your ORM.`)}`));
        console.log(`${colors.cyan(`So you can choose any orm and setting up it in your project.`)}`);
    }
}

(async(): Promise<void> => await initializePrismaFunction())();