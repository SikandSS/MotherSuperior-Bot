const discord = require("discord.js");
const { prefix, token } = require('./config.json');
const client = new discord.Client();

client.once('ready', ()=>{
    console.log("Ready!");
    
});

client.on('message', message =>{
    // Checking permissions of the person using the commands
    if(message.member.hasPermission(['KICK_MEMBERS','BAN_MEMBERS'])) {
    // Defining Different commands
    // Defininf Kick command
        if(message.content.startsWith(`${prefix}kick`)){
            // message.channel.send("Kick!");
            let member = message.mentions.members.first();
            member.kick().then((member) => {
                message.channel.send(":wave:" + member.displayName + "has been kicked!");
            });
        }
        
        if(message.content.startsWith.startsWith(`${prefix}ban`)){
            let member = message.mentions.members.first();
        }
    }
});

client.login(token);