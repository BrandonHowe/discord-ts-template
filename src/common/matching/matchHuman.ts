import { Matcher } from "@enitoni/gears-discordjs";

export const matchHuman = (): Matcher => context => {
    const { author } = context.message;

    const matches = !author.bot;
    if (matches) {
        return context;
    }
};
