# Discord Madlibs

## About

-   This npm package helps you to make madlibs games in discord easier.

## How to Use

### Install the package

To install the package, run this command in your console.

```bash
npm i discord-madlibs@latest
```

### Basic code structure

`index.js`

```js
import { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = from "discord.js"; // assuming you already have discord.js installed.

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("messageCreate", async msg => {
    const tokens = msg.split(/ +/g);
    if (tokens[0] === ".madlibs") {
        const args = tokens.shift();
        /* the rest will be filled out after the package is fully released */
    }
});

client.login("YOUR TOKEN HERE");
```

## Contributing

Contributions are welcome! If you encounter any issues, have suggestions, or want to contribute improvements, feel free to open issues and pull requests in this repository.

## License

This project is open source and available under the `MIT License`.
