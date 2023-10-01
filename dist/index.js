import axios from "axios";
import { ChannelType, } from "discord.js";
const sleep = (ms = 2000) => new Promise((resolve, reject) => setTimeout(resolve, ms));
async function collectMessage(client, channelID, userID) {
    const channel = client.channels.cache.get(channelID);
    if (channel.type !== ChannelType.GuildText)
        throw new Error("Madlibs can only be played in a Text Channel.");
    const collectorFilter = (m) => m.author.id === userID;
    const collector = channel.createMessageCollector({
        time: 30000,
        max: 1,
        filter: collectorFilter,
    });
    let message;
    collector.on("end", async (collection) => {
        message = collection.at(0);
        return;
    });
    return message;
}
async function getAnswer(interaction, pos) {
    await interaction.channel.send(`Enter a ${pos}:`);
    let answer = await collectMessage(interaction.client, interaction.channel.id, interaction.user.id);
    if (!answer) {
        await interaction.channel.send(`Please Enter an Answer.`);
        await getAnswer(interaction, pos);
    }
    return answer.content;
}
async function play(interaction) {
    if (!interaction)
        throw new TypeError("Provided interaction cannot be null.");
    const URL = "https://madlibs-api.vercel.app/api/random";
    let response;
    try {
        response = await axios({
            url: URL,
            method: "GET",
        });
    }
    catch (e) {
        throw new Error("Error while fetching from the API:\n" + e);
    }
    let data = response.data;
    const answers = [];
    data.blanks.forEach(async (blank) => {
        let answer = await getAnswer(interaction, blank);
        answers.push(answer);
    });
    await interaction.channel.send("Completed all the blanks!");
    await sleep();
    let i;
    let l = Math.min(data.text.length, answers.length);
    const story = [];
    for (i = 0; i < l; i++) {
        story.push(data.text[i], answers[i]);
    }
    story.push(...data.text.slice(l), ...answers.slice(l));
    const finalEmbed = {
        color: 0x2b2d31,
        title: `Story: ${data.title}`,
        description: `${story.join("")}`,
        footer: {
            text: `${interaction.client.user.username} | ${interaction.guild.name}`,
        },
        timestamp: new Date().toISOString(),
    };
    await interaction.channel.send({ embeds: [finalEmbed] });
}
export default play;
//# sourceMappingURL=index.js.map