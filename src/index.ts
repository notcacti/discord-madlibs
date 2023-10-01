import axios from "axios";
import {
    APIEmbed,
    CommandInteraction,
    Client,
    ChannelType,
    Message,
    Channel,
} from "discord.js";

const sleep = (ms: number = 2000) =>
    new Promise((resolve, reject) => setTimeout(resolve, ms));

type APIResponse = {
    title: string;
    text: string[];
    blanks: string[];
};

async function collectMessage(
    client: Client,
    channel: Channel,
    userID: string
): Promise<string | undefined> {
    if (channel.type !== ChannelType.GuildText)
        throw new Error("Madlibs can only be played in a Text Channel.");

    return new Promise((resolve, reject) => {
        const collectorFilter = (m) => m.author.id === userID;

        const collector = channel.createMessageCollector({
            max: 1,
            time: 60000,
            filter: collectorFilter,
        });

        collector.on("collect", async (m) => {
            const msg = m.content;
            collector.stop();
            resolve(msg);
        });

        collector.on("end", (collected, reason) => {
            if (reason === "time") {
                resolve(undefined); // Resolve with undefined on timeout
            }
        });
    });
}

async function getAnswer(
    interaction: CommandInteraction,
    pos: string
): Promise<string> {
    await interaction.channel.send(`Enter a ${pos}:`);

    let answer = await collectMessage(
        interaction.client,
        interaction.channel,
        interaction.user.id
    );

    if (!answer || answer.length <= 0) {
        await interaction.channel.send(`Please Enter an Answer.`);
        await getAnswer(interaction, pos);
    } else {
        return answer;
    }
}

async function play(interaction: CommandInteraction) {
    if (!interaction)
        throw new TypeError("Provided interaction cannot be null.");

    const URL = "https://madlibs-api.vercel.app/api/random";

    let response;
    try {
        response = await axios({
            url: URL,
            method: "GET",
        });
    } catch (e) {
        throw new Error("Error while fetching from the API:\n" + e);
    }

    let data: APIResponse = response.data;

    let answers: string[] = [];

    for (const blank of data.blanks) {
        let answer = await getAnswer(interaction, blank);
        answers.push(answer);
    }

    await interaction.channel.send(
        "Completed all the blanks! Story coming up!"
    );
    await sleep();

    let l = Math.min(data.text.length, answers.length);

    const story: string[] = [];

    for (let i = 0; i < l; i++) {
        story.push(data.text[i], answers[i]);
    }
    story.push(...data.text.slice(l), ...answers.slice(l));

    const finalEmbed: APIEmbed = {
        color: 0x2b2d31,
        title: `Story: ${data.title}`,
        description: `${story.join("")}`,
        footer: {
            text: `${interaction.client.user.username} | ${interaction.guild.name}`,
        },
        timestamp: new Date().toISOString(),
    };

    await interaction.channel.send({ embeds: [finalEmbed] });

    return;
}

export default play;
