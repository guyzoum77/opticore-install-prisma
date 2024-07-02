import path from "node:path";
import fs from "fs";
import {promisify} from "util";
import cp from "child_process";

export async function prismaProviderUtils(provider: string): Promise<void> {
    const asyncExec = promisify(cp.exec);
    try {
        await asyncExec(`npx prisma init --datasource-provider ${provider}`, { cwd: path.join(process.cwd()) });
    } catch (error: any) {
        console.error("Error executing command:", error.message);
        fs.rmSync(path.join(process.cwd()) + "/prisma", { recursive: true, force: true });
    }
}