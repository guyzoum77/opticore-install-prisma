import gradient from "gradient-string";

export function welcomeMessage(): void {
    return console.log(gradient('cyan', 'pink', 'orange')('╭─────────────────────────────────────────────────╮\n' +
        '│                                                 │\n' +
        '│          Welcome an Auth Model CLI              │\n' +
        '│                                                 │\n' +
        '╰─────────────────────────────────────────────────╯\n'));
}

