import { SlashCommandBuilder } from "@discordjs/builders";
import { Routes } from "discord-api-types/v10";
import { REST } from "@discordjs/rest"; 
import dotenv from "dotenv";

dotenv.config();

const commands = [
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Tests bot ping."),
    new SlashCommandBuilder()
        .setName("madlib")
        .setDescription("Creates a Madlib for the user.").
    addStringOption((option) => {
        return option
        .setName("title")
        .setDescription("Make up a random title for the Madlib.")
        .setRequired(true)
    }),
].map((command) => command.toJSON());

const rest = new REST().setToken(process.env.TOKEN);


try {
    rest.put(
    Routes.applicationGuildCommands(
        process.env.CLIENT_ID, 
        process.env.GUILD_ID
    ), 
    {
        body: commands, 
    }
    ).then(() => console.log("Successful registered commands."));

    console.log("Done.");
} catch(err) {
    console.log(err);
}