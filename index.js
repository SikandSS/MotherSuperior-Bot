const discord = require("discord.js");
const { prefix, token } = require('./config.json');
const client = new discord.Client();

client.once('ready', ()=>{
    console.log("Ready!");
    
});

client.on('message', message =>{
    // Checking permissions of the user for valid commands
    if(message.member.hasPermission(['KICK_MEMBERS','BAN_MEMBERS'])) {
    // Defining Moderation commands
        // Defining Kick command
        if(message.content.startsWith(`${prefix}kick`)){
            const user = message.mentions.users.first();
                if (user)
                {
                    const member = message.guild.member(user);
                    if (member) {
                        member.kick().then(() => {
                            message.reply(`Successfully kicked ${user.tag}`);
                        }).catch(err => {
                            message.reply('I was unable to kick the member');
                            console.error(err);
                        });
                    } else {
                        message.reply("That user isn't in this guild");
                    }

                } else {
                    message.reply("You didn't mention the user to be kicked!");
                }
            }
        }

        if(message.content.startsWith(`${prefix}ban`)){
            const user = message.mentions.users.first();
            if(user){
                const member = message.guild.member(user);
                if(member){
                    member.ban({reason:"You've been naughty",}).then(() => {
                        message.reply(`Successfully banned ${user.tag}`);
                    }).catch(err => {
                        message.reply('I was unable to ban the member');
                        console.error(err);
                    });
                } else {
                    message.reply("That user isn't in this server");
                }
            } else {
                message.reply("You didn't mention the user to ban!");
            }
        }

});
        

        
    


client.login(token);