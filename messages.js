const webpack = require("powercord/webpack");

module.exports = {
    respond: async (data) => {
        const channelId = webpack.channels.getChannelId();
        const message = (await webpack.getModule(["createBotMessage"])).createBotMessage(channelId, "");

        await webpack.getModule(["receiveMessage"], false).receiveMessage(channelId, {
            ...message,
            ...data
        });
    },
    
    error: (message, extra) => {
        let content = "```diff\n->> ERROR: " + message;
        if (extra !== undefined) content += `\n             (${extra})`;
        content += "\n```";
        return {
            content
        }
    }
}