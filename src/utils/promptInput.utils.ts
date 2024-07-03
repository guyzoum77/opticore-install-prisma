import clackCLI from "@clack/prompts";
import colors from "ansi-colors";

export async function promptInputUtils(message: string, initialValue: any, options: any): Promise<string[]> {
    const input: symbol | string[] = await clackCLI.select({
        message: message,
        initialValue: initialValue,
        options: options
    });
    if (clackCLI.isCancel(input)) {
        console.error(`${colors.bgRed(`${colors.white("Operation cancelled.")}`)}`);
        process.exit(0);
    }

    return input;
}

// 'Please specify a provider that you want and prisma will be configure it, and create schema model',