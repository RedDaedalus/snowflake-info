module.exports = id => { return {
    embeds: [{
        type: "rich",
        author: {
            name: "❄️ Snowflake Info"
        },

        fields: [{
            name: "» Created",
            value: `<t:${((id >> 22n) + 1420070400000n) / 1000n}:R>`,
            inline: true
        }, {
            name: "» Worker ID",
            value: `${(id & 0x3E0000n) >> 17n}`,
            inline: true
        }, {
            name: "",
            value: "",
            inline: true
        }, {
            name: "» Process ID",
            value: `${(id & 0x1F000n) >> 12n}`,
            inline: true
        }, {
            name: "» Increment",
            value: `${id & 0xFFFn}`,
            inline: true
        }, {
            name: "",
            value: "",
            inline: true
        }],

        footer: {
            text: `Information on ${id}`
        }
    }]
} }