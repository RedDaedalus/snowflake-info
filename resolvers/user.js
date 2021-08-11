const webpack = require("powercord/webpack");
const { error } = require("../messages");

/**
 * A map of number -> string with keys of bits and values of emojis
 * representing matching badges.
 */
const FLAGS = Object.freeze({
    [1 << 16]: "<:bot:700325427998097449><:bot:700325521665425429>", // Verified bot
    [1 << 30]: "<insert bot tag here>",                              // Bot (fake flag)
    [1 << 0]: "<:staff:842194494065082390>",                         // Discord Staff
    [1 << 1]: "<:partner:842194493608427571>",                       // Partnered Server Owner
    [1 << 18]: "<:certified_discord_moderator:847961875463667762>",  // Discord Certified Moderator
    [1 << 2]: "<:hypesquad_events:714835064822956104>",              // HypeSquad Events
    [1 << 6]: "<:hypesquad_bravery:778877338988707841>",             // HypeSquad Bravery
    [1 << 7]: "<:hypesquad_brilliance:778877104712056832>",          // HypeSquad Brilliance
    [1 << 8]: "<:hypesquad_balance:778877245753786368>",             // HypeSquad Brilliance
    [1 << 3]: "<:bug_hunter_lvl1:842194493750640650>",               // Bug Hunter Level 1
    [1 << 14]: "<:bug_hunter_lvl2:714835631452192789>",              // Bug Hunter Level 2
    [1 << 17]: "<:early_verified_bot_dev:698313392728834049>",       // Early Verified Bot Developer
    [1 << 9]: "<:early_supporter:714860883880443985>",               // Early Supporter 
    [1 << 31]: "<:nitro:749062669851688971>"                         // Nitro (fake flag)
})

module.exports = async id => {
    const idString = String(id);

    const module = await webpack.getModule(["getUser"]); // Contains methods to get the user and fetch the profile.
    const profileModule = await webpack.getModule(["getUserProfile"]); // Contains a method to get the cached profile.

    // Attempt to resolve the user.
    let user;
    try {
        user = await module.getUser(idString);
    } catch(err) {
        return error("Unknown user", id);
    }

    // Load the user's profile.
    let profile = null;
    try {
        profile = await profileModule.getUserProfile(idString); // Attempt to get the cached profile.

        if (!profile) {
            await new Promise(async (resolve, reject) => {
                await module.fetchProfile(idString, idString, resolve).catch(reject); // Fetch the profile if needed.
            }).catch(() => {});

            profile = await profileModule.getUserProfile(idString) || null; // Get the now cached profile. 
        }

        if (profile) user = await module.getUser(idString); // Reload the user now that the profile is available.
    } catch(err) {
        // Profile loading failed; do nothing.
    }

    console.log(profile);

    const fields = [{
        name: "» Created",
        value: `<t:${((id >> 22n) + 1420070400000n) / 1000n}:R>`,
        inline: true
    }, {
        name: "» Mention",
        value: `<@!${id}>`,
        inline: true
    }, {
        name: "» Account type",
        value: user.bot ? "Bot" : user.system ? "System" : "User",
        inline: true
    }];

    if (user.bio) fields.push({
        name: "",
        value: ""
    }, {
        name: "» About this user",
        value: user.bio
    });

    let flags = user.flags;

    // Add fake flags
    if (user.bot && !(flags & ( 1 << 16))) flags |= 1 << 30;
    if (profile?.premiumSince) flags |= 1 << 31;

    let badges = "";
    for (flag of Object.keys(FLAGS)) {
        if (flags & flag) badges += FLAGS[flag] + " ";
    }

    return {
        embeds: [{
            type: "rich",
            color: user.accentColor,

            author: {
                name: user.tag,
                proxy_icon_url: user.getAvatarURL()
            },
            description: (!profile || profile?.profileFetchFailed ? "<:warn:839325738784260117> Failed to load profile data\n" : "") + badges,

            fields,
            image: user.banner ? {
                url: user.bannerURL,
                proxy_url: user.bannerURL,
                width: 600,
                height: 240
            } : null,

            footer: {
                text: `Information on ${id}`
            }
        }]
    }
}