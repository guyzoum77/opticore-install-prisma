#!/usr/bin/env node

import colors from "ansi-colors";
import fs from "fs";
import path from "path";
import {welcomeMessage} from "./utils/welcomeMessage";
import {prismaProviderUtils} from "./utils/prismaProvider.utils";
import {promptInputUtils} from "./utils/promptInput.utils";

export async function initializePrismaFunction(): Promise<void> {
    let ora = (await import("ora")).default;
    welcomeMessage();

    const installPrismaORM: symbol | string[] =  await promptInputUtils(
        "Do you want install Prisma ORM ?",
        ["prisma_orm"],
        [
            {label: "Yes, i want to install Prisma ORM.", value: ["prisma_orm"]},
            {label: "No, i don't want it.", value: ['no_prisma_orm']},
        ],
    );
    installPrismaORM[0] === "prisma_orm"
        ? await (async(): Promise<void> => {
            const providerSelected: symbol | string[] = await promptInputUtils(
                'Please specify a provider that you want and prisma will be configure it, and create schema model',
                ['mysql'],
                [
                    {label: 'MySQL', value: ['mysql']},
                    {label: 'Mongo DB', value: ['mongodb']},
                    {label: 'Postgres', value: ['postgresql']},
                ]
            );
            if (fs.existsSync(path.join(process.cwd()) + "/prisma/schema.prisma")) {
                console.error(`${colors.bgCyan(`${colors.white("Prisma has been already installed in your project.")}`)}`);
                process.exit(0);
            } else {
                try {
                    const prismaORMSpinner = ora("Configuration of prisma schema...").start();
                    providerSelected.map(async (selected: string): Promise<void> => {
                        switch (selected) {
                            case "mysql":
                                console.log("selected is :", selected);
                                await prismaProviderUtils("mysql", prismaORMSpinner);
                                break;
                            case "mongodb":
                                console.log("selected is :", selected);
                                await prismaProviderUtils("mongodb", prismaORMSpinner);
                                break;
                            case "postgresql":
                                console.log("selected is :", selected);
                                await prismaProviderUtils("postgresql", prismaORMSpinner);
                                break;
                        }
                    });
                } catch (err: any) {
                    console.error(`${colors.bgRed(`${colors.white(err.message)}`)}`);
                    process.exit(0);
                }
            }
        })()
        : (() => {
            console.log(colors.bgCyan(`${colors.white(`You did not choose prisma as your ORM.`)}`));
            console.log(`${colors.cyan(`So you can choose any orm and setting up it in your project.`)}`);
        })();
}

(async(): Promise<void> => await initializePrismaFunction())();