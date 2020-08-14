import { Command } from "@enitoni/gears-discordjs";

import { ParseArgumentsState } from "../../common/parsing/middleware/parseArguments";
import { matchPrefixes } from "@enitoni/gears";

export default new Command()
    .match(matchPrefixes("ping"))
    .use<ParseArgumentsState>(context => {
        const { message } = context;

        return message.channel.send("pong");
    });
