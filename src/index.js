import { Client, Intents } from "discord.js";
import MadLib from "./madlib-templates.js";
import dotenv from "dotenv";


const client = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
});

dotenv.config();

client.on("ready", () => {
    console.log("Listening for madlib requests.");

});

const awaitingReply = [];

client.on("interactionCreate", (interaction) => {
    if(!interaction.isCommand()) return;

    const { commandName, options } = interaction;
    console.log = (interaction.toString());

    if(commandName === "ping") {
        interaction.reply(`Pong! - ${interaction.client.ws.ping}ms`);
    } else if (commandName === "madlib"){
        const title = options.getString("title");

        const text = MadLib.text;
        const requirements = MadLib.requirements;

        let returnMessage = 
            "Let's make a MadLib :3 ! Reply to this message in this format:";
        for(let req of requirements) returnMessage += "\n" + req;

        awaitingReply.push({
            userID: interaction.user.id,
            title,
        });
        
        interaction.reply(returnMessage);
        
    }

});

client.on("messageCreate", (msg) => {
    const author = msg.author.id;
    const text = msg.CleanContent;

    if(author === process.env.CLIENT_ID) 
    return;

    for (let i = 0; i < awaitingReply.length; i++){
        let obj = awaitingReply[i];
        console.log(obj);
        if (author === obj.userID){
            console.log(`Found a match for ${author}\n${text}`);

            const replyContent = text.split("\n");
            let textTemplate = MadLib.text;
            if (replyContent.length !== MadLib.requirements.length){
                msg.reply(
                    "Could not complete madlib - inputs were not correct."
                );
                return;
            }
            
            for (let i = 0; i<= replyContent.length; i++){
                const compositeString = "{" + i + "}";
                textTemplate = textTemplate.replaceAll(
                    compositeString,
                    replyContent[i]
                );
            }

            msg.reply(
                `Here's your completed madlib - '${obj.title}'\n\n${textTemplate}`
            );

            awaitingReply.splice(i, 1);
        }
    }
});

client.login(process.env.TOKEN);