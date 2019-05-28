import Discord, {Channel, Message, User} from "discord.js";
import { config, BotConfig } from "./config/config";
import { CommandHandler } from "./command_handler";
import {Runtime} from "inspector";


const commandHandler = new CommandHandler(config.prefix);

const client = new Discord.Client();

interface pussy {
  time : any,
    channel: Channel,
    user: User
}

let pussyList: pussy[] = [];

client.on("ready", () => {
  console.log("Bot has started");
});

client.on("message", (message: Message) => {
    for(let i = 0; i < pussyList.length; i++) {
        if (message.channel.id == pussyList[i].channel.id && message.author.id == pussyList[i].user.id) {
            pussyList.splice(i, 1);
            console.log("Message send remove.");
        }
    }
    commandHandler.handleMessage(message);
});

client.on("typingStart", (channel: Channel, user: User) => {
    console.log(`${user.tag} has started typing`);
    pussyList.push({time: new Date().getTime(), user: user, channel: channel});
});

client.on("typingStop", (channel: any, user: User) =>{
    console.log(`${user.tag} has stopped typing`);
    setTimeout(() => {
        let now: any = new Date().getTime();
        for(let i = 0; i < pussyList.length; i++) {
            if (channel.id == pussyList[i].channel.id && user.id == pussyList[i].user.id) {
                if (now - pussyList[i].time > 5000) {
                    channel.send(pussyList[i].user.tag + " is a pussy. Say what you were gonna say faggot.");
                    console.log("Time passed: " + (now - pussyList[i].time));
                    pussyList.splice(i, 1);
                } else {
                    console.log("Not enough time")
                }
            }
        }

    }, 5000);
});

client.on("error", e => {
  console.error("Discord client error!", e);
});

client.login(config.token);

/** Pre-startup validation of the bot config. */
function validateConfig(config: BotConfig) {
  if (!config.token) {
    throw new Error("You need to specify your Discord bot token!");
  }
}
