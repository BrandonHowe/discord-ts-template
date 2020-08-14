import { Bot, Adapter } from "@enitoni/gears-discordjs";

const adapter = new Adapter({ token: process.env.BOT_TOKEN! });

const bot = new Bot({ adapter });

bot.start().then(() => {
    console.log("Hello world!");
});
