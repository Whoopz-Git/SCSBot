module.exports = {
    name: 'scs',
    desc: "Displays social credit score of user",
    execute(message, args, Discord, usernameVar, scsVar) {
        const newEmbed = new Discord.MessageEmbed()
        .setTitle('Social Credit Score of ' + usernameVar)
        .addFields(
            {name: 'Social Credit Score:', value: scsVar}
        )
        .setFooter('Thank you for supporting the Chinese Communist Party');

        message.channel.send({ embeds: [newEmbed] });
    }
}