import clackCLI from "@clack/prompts";
import colors from "ansi-colors";
import {promisify} from "util";
import {exec} from "node:child_process";

export default async function initializePrismaFunction(projectName: string, provider: string | any) {
    const asyncExec = promisify(exec);
    let ora = (await import("ora")).default;

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
        const prismaSpinner= ora("Installing Prisma ORM\n").start();
        await asyncExec(
            `npx prisma init --datasource-provider ${provider}`,
            { cwd: projectName }
        ).then(async() => {
            await asyncExec(`npx prisma generate`, { cwd: projectName });
        });

    } else {
        console.log(colors.bgCyan(`${colors.white(`You did not choose prisma as your ORM.`)}`));
    }
}