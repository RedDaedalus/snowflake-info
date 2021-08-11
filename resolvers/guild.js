const webpack = require("powercord/webpack");
const { error } = require("../messages");

const VERIFICATION_LEVELS = Object.freeze({
    [0]: "None",
    [1]: "Low",
    [2]: "Medium",
    [3]: "High",
    [4]: "Highest"
});
const MFA_LEVELS = Object.freeze({
    [0]: "Default",
    [1]: "2FA Required"
});
const NSFW_LEVELS = Object.freeze({
    [0]: "Default",
    [1]: "Explicit",
    [2]: "Safe",
    [3]: "Restricted"
});
const MESSAGE_NOTIFICATION_LEVELS = Object.freeze({
    [0]: "All messages",
    [1]: "Only @mentions"
});
const EXPLICIT_CONTENT_FILTER_LEVELS = Object.freeze({
    [0]: "Off",
    [1]: "Members without roles",
    [2]: "Everyone"
});

module.exports = async id => {
    const module = await webpack.getModule(["getGuild"]);
    const guild = await module.getGuild(String(id));

    console.log(guild);

    if (!guild) return error("Unknown guild", id);

    // Cache the guild owner
    await (await webpack.getModule(["getUser"])).getUser(guild.ownerId);

    const fields = [{
        name: "» Created",
        value: `<t:${((id >> 22n) + 1420070400000n) / 1000n}:R>`,
        inline: true
    }, {
        name: "» Owner",
        value: `<@!${guild.ownerId}>`,
        inline: true
    }, {
        name: "» Acronym",
        value: guild.acronym,
        inline: true
    }, {}, {
        name: "» Verification level",
        value: VERIFICATION_LEVELS[guild.verificationLevel],
        inline: true
    }, {
        name: "» MFA level",
        value: MFA_LEVELS[guild.mfaLevel],
        inline: true
    }, {
        name: "» NSFW level",
        value: NSFW_LEVELS[guild.nsfwLevel],
        inline: true
    }, {
        name: "» Notifiication level",
        value: MESSAGE_NOTIFICATION_LEVELS[guild.defaultMessageNotifications],
        inline: true
    }, {
        name: "» Content filter level",
        value: EXPLICIT_CONTENT_FILTER_LEVELS[guild.explicitContentFilter],
        inline: true
    }, {
        name: "» Server boost level",
        value: `Tier ${guild.premiumTier} (${guild.premiumSubscriberCount} boost${guild.premiumSubscriberCount === 1 ? "" : "s"})`,
        inline: true
    }, {}, {
        name: "» System channel",
        value: guild.systemChannelId ? `<#${guild.systemChannelId}>` : "Unset",
        inline: true
    }, {
        name: "» Rules channel",
        value: guild.rulesChannelId ? `<#${guild.rulesChannelId}>` : "Unset",
        inline: true
    }, {
        name: "» AFK channel",
        value: guild.afkChannelId ? `<#${guild.afkChannelId}>` : "Unset",
        inline: true
    }, {
        name: "» Features",
        value: Array.from(guild.features).map(feat => `• ${feat.charAt(0) + feat.replaceAll("_", " ").toLowerCase().substring(1)}`).join("\n")
    }];

    return {
        embeds: [{
            type: "rich",

            author: {
                name: guild.name,
                proxy_icon_url: guild.getIconURL()
            },


            description: guild.description,
            fields,

            footer: {
                text: `Information on ${id}`
            }
        }]
    }
}