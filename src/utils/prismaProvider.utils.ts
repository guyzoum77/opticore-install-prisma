import path from "node:path";
import fs from "fs";
import {promisify} from "util";
import cp from "child_process";
import colors from "ansi-colors";


export async function prismaProviderUtils(provider: string, prismaORMSpinner: any): Promise<void> {
    const asyncExec = promisify(cp.exec);
    try {
        await asyncExec(`npx prisma init --datasource-provider ${provider}`, { cwd: path.join(process.cwd()) });
    } catch (error: any) {
        console.error("Error executing command:", error.message);
        fs.rmSync(path.join(process.cwd()) + "/prisma", { recursive: true, force: true });
    }

    prismaORMSpinner.succeed();
    console.log(`${colors.bgGreen(`${colors.white(`The packages prisma and @prisma/client are been installed successfully.`)}`)}`);

    // Modify the .env file to remove or comment out the DATABASE_URL
    const envFilePath: string = path.join(path.join(process.cwd()), '.env');
    if (fs.existsSync(envFilePath)) {
        let envContent: string = fs.readFileSync(envFilePath, 'utf8');
        envContent = envContent.replace(/^DATABASE_URL=.*$/m, '');
        fs.writeFileSync(envFilePath, envContent, 'utf8');
    }
    console.log(`${colors.cyan(`created`)} : ${colors.green(`prisma/prisma.schema`)}`);
    console.log("\nNow you can use Prisma by instantiating the Prisma client by calling it like this :");
    console.log(`${colors.cyan(`const prisma = new PrismaClient();`)}`);
}