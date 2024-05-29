import gradient from "gradient-string";

export function welcomeMessage(): void {
    return console.log(gradient('cyan', 'pink', 'orange')('╭─────────────────────────────────────────────────╮\n' +
        '│                                                 │\n' +
        '│       Welcome To prisma ORM installer CLI       │\n' +
        '│                                                 │\n' +
        '╰─────────────────────────────────────────────────╯\n'));
}

