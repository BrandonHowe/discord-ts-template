import { Bot, Adapter, CommandGroup } from "@enitoni/gears-discordjs";
import { matchPrefixes } from "@enitoni/gears";
import { prefix } from "./modules/constants";
import { parseArguments } from "./common/parsing/middleware/parseArguments";
import ping from "./modules/commands/ping";

const adapter = new Adapter({ token: process.env.BOT_TOKEN! });

const commands = new CommandGroup()
    .match(matchPrefixes(prefix))
    .use(parseArguments)
    .setCommands(ping);

const bot = new Bot({ adapter, commands: [commands] });

bot.start().then(() => {
    console.log("Bot started!");
});
