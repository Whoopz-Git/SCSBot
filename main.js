const Discord = require('discord.js');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: ["GUILDS", "GUILD_MESSAGES"] });

const prefix = '-';
const fs = require('fs');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./cmds/').filter(file => file.endsWith('.js'));
var dataPath = './userdata.json';
var dataRead = fs.readFileSync(dataPath);
var dataFile = JSON.parse(dataRead);

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
        var userId = message.author.id;
        if(!dataFile[userId]){
            dataFile[userId] = {username: message.author.username, scs: "1000"};
            var usernameVar = message.author.username;
            var scsVar = "1000";
            fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 2));
        } else {
            var usernameVar = (dataFile[userId].username);
            var scsVar = String(dataFile[userId].scs);
            dataFile[userId] = {username: usernameVar, scs: scsVar};
            fs.writeFileSync(dataPath, JSON.stringify(dataFile, null, 2));
        }
        client.commands.get('scs').execute(message, args, Discord, usernameVar, scsVar);
    } else if(command === 'mao'){
        client.commands.get('mao').execute(message, args);
    }

});

client.login('OTA5NjAxODU3NjY2Njc4ODI1.YZGqvg.tu4JvzWweL0U26Q7GLAph-nbQ2A');