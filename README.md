# Discord Madlibs

## About

This npm package helps you to make madlibs games in discord easier.

## How to Use

### Install the package

To install the package, run this command in your console.

```bash
npm i discord-madlibs@latest
```

### Basic code structure

`JavaScript (CommonJS)`

```js
/* assuming you already have discord.js installed. */
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", async () => {
    console.log("Ready!");
    await client.application.commands.create({
        name: "madlibs",
        description: "Play Madlibs!",
    });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "madlibs") {
        import("discord-madlibs").then(async (game) => {
            await interaction.reply("Starting madlibs...");
            await game.default(interaction);
            /* The game will send all the replies itself. */
        });
    } else {
    }
});

client.login("YOUR TOKEN HERE");
```

`JavaScript (ESModules)`

```js
import { Client, GatewayIntentBits } from "discord.js";
import game from "discord-madlibs";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", async () => {
    console.log("Ready!");
    await client.application.commands.create({
        name: "madlibs",
        description: "Play Madlibs!",
    });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "madlibs") {
        await interaction.reply("Starting madlibs...");
        game(interaction);
    } else {
    }
});

client.login("YOUR TOKEN HERE");
```

## Contributing

Contributions are welcome! If you encounter any issues, have suggestions, or want to contribute improvements, feel free to open issues and pull requests in this repository.

## License

This project is open source and available under the `MIT License`.
