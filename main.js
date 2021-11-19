const Discord = require('discord.js');

const client = new Discord.Client ({ 
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]
});

const prefix = '-';
const fs = require('fs');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./cmds/').filter(file => file.endsWith('.js'));

for (const file of commandFiles){
    const command = require(`./cmds/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('SCS Bot is online.')
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot)
        return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'scs'){
        var dataPath = './userdata.json';
        var dataRead = fs.readFileSync(dataPath);
        var dataFile = JSON.parse(dataRead);
        var guildId = message.guildId;
        var userId = message.author.id;
        if(!dataFile[guildId]){
            dataFile[guildId] = {};
            fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 2));
        }
        if(!dataFile[guildId][userId]){
            dataFile[guildId][userId] = {username: message.author.username, scs: "1000"};
            var usernameVar = message.author.username;
            var scsVar = "1000";
            fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 2));
        } else {
            var usernameVar = (dataFile[guildId][userId].username);
            var scsVar = String(dataFile[guildId][userId].scs);
            dataFile[guildId][userId] = {username: usernameVar, scs: scsVar};
            fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 2));
        }
        client.commands.get('scs').execute(message, args, Discord, usernameVar, scsVar);
    } else if(command === 'mao'){
        client.commands.get('mao').execute(message, args);
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    const scsP15 = '👍';
    const scsM30 = '👎';
    if (reaction.message.partial) 
        await reaction.message.fetch();
    if(reaction.partial)
        await reaction.fetch();
    if(user.bot)
        return;
    if(!reaction.message.guild)
        return;

    if(reaction.emoji.name != scsP15 && reaction.emoji.name != scsM30)
        return;
    else {
        var dataPath = './userdata.json';
        var dataRead = fs.readFileSync(dataPath);
        var dataFile = JSON.parse(dataRead);
        var guildId = reaction.message.guildId;
        var userId = reaction.message.author.id;
        if(!dataFile[guildId]){
            dataFile[guildId] = {};
            fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 2));
        }
        if(!dataFile[guildId][userId]){
            dataFile[guildId][userId] = {username: reaction.message.author.username, scs: "1000"};
            fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 2));
        } 
        if(reaction.emoji.name === scsP15){
            var scsNum = Number(dataFile[guildId][userId].scs);
            scsNum += 15;
            var scsString = String(scsNum);
            dataFile[guildId][userId] = {username: reaction.message.author.username, scs: scsString};
            fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 2));
            console.log(`${reaction.message.author}'s SCS up 15`);
        } else {
            if(reaction.emoji.name === scsM30) {
                var scsNum = Number(dataFile[guildId][userId].scs);
                scsNum -= 30;
                dataFile[guildId][userId] = {username: reaction.message.author.username, scs: String(scsNum)};
                fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 2));
                console.log(`${reaction.message.author}'s SCS down 30`);
            }
        }
    }

    //console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!'`);
})

client.login('OTA5NjAxODU3NjY2Njc4ODI1.YZGqvg.tu4JvzWweL0U26Q7GLAph-nbQ2A');