const { Plugin } = require("powercord/entities");
const webpack = require("powercord/webpack");

const resolvers = require("./resolvers");
const { respond, error } = require("./messages");

module.exports = class extends Plugin {
    startPlugin() {
        powercord.api.commands.registerCommand({
            command: "info",
            label: "Shows information fetched from a snowflake",
            usage: "{c} snowflake|user <id>",
            description: "Show information on a snowflake",
            executor: this.executeCommand,
            autocomplete: this.getCompletions
        });
    }

    async executeCommand([type, value]) {
        try {
            const id = BigInt(value);
            const resolver = resolvers[type];

            respond(await (resolver?.call(window, id) ?? error("Unknown snowflake type!", type)));
        } catch(err) {
            console.error(err);
            respond(error("Invalid snowflake value!", value));
        }
    }

    getCompletions(args) {
        if (args[0] !== undefined && args.length === 1) {
            return {
                commands: Object.keys(resolvers)
                            .filter(c => c.includes(args[0].toLowerCase()))
                            .map(name => { return { command: name } }),
                header: "Snowflake types" 
            }
        }
    }

    pluginWillUnload() {
        powercord.api.commands.unregisterCommand("info");
    }
}
