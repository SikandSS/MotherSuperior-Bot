// 
require("dotenv").config();
const PREFIX = process.env.PREFIX;
const discord = require("discord.js");
const bot = new discord.Client();
const config = require("./config/config.json");

// 
bot.on("ready", () => {
    console.log(`${bot.user.tag} has logged in.`);
    bot.user.setActivity("Prefix !",{type:"STREAMING"});
});


// 
const isValidCommand = (message,cmdName) => message.content.toLowerCase().startsWith(PREFIX + cmdName);
const rolldice = () => Math.floor(Math.random() * 6) + 1;
const checkPermissionRole = (role) => 
role.permissions.has('ADMINISTRATOR') || 
role.permissions.has("KICK_MEMBERS") ||
role.permissions.has("BAN_MEMBERS") ||
role.permissions.has("MANAGE_CHANNELS") ||
role.permissions.has("MANAGE_GUILD");


// 
bot.on("message", function(message){
    // 
    if(message.author.bot) return;
    // 
    if(isValidCommand(message,"hello")){
        message.reply("Hello!");
    }
    // 
    else if(isValidCommand(message, "rolldice")) {
        message.reply("rolled a " + rolldice());
    }
    // 
    else if(isValidCommand(message,"add")){
        let args = message.content.toLowerCase().substring(5);
        let roleNames = args.split(", ");
        let roleSet = new Set(roleNames);
        let { cache } = message.guild.roles;


        roleSet.forEach(roleName =>{
            let role = cache.find(role => role.name.toLowerCase() === roleName);
            if(role){
                if(message.member.roles.cache.has(role.id)){
                    message.channel.send("You already have this role!");
                    return;
                }
                if(checkPermissionRole(role)){
                    message.channel.send("You can't have this role.")
                }
                else {
                    message.member.roles.add(role)
                    .then(member => message.channel.send("You were added to this role!"))
                    .catch(err => {
                        console.log(err);
                        message.channel.send("Something went wrong...");
                    });
                }
            }
            else{
                message.channel.send("Role not found");
            }
    
            
        });
    }

    else if(isValidCommand(message,"del")){
        let args = message.content.toLowerCase().substring(5);
        let roleNames = args.split(", ");
        let roleSet = new Set(roleNames);
        let { cache } = message.guild.roles;
        
        roleSet.forEach(roleName =>{

            let role = cache.find(role => role.name.toLowerCase() === roleName);
            if(role){
                if(message.member.roles.cache.has(role.id)){
                    message.member.roles.remove(role)
                    .then(member => message.channel.send("Your role was removed."))
                    .catch(err => {
                        console.log(err);
                        message.channel.send("Something went wrong...");
                    });
                }
                
            }
            else{
                message.channel.send("Role not found");
            }
    
            
        });
    }
    
    else if(isValidCommand(message, "embed")){
        let embedContent = message.content.substring(7);
        // let embed = new discord.MessageEmbed();
        // embed.addField("Message", embedContent);
        // embed.setColor("#63d6ff");
        // embed.setTitle("New embed Message Create");
        // embed.setTimestamp();
        // embed.setImage(message.author.displayAvatarURL());
        // embed.setAuthor(message.author.tag,message.author.displayAvatarURL());
        // embed.setThumbnail(message.author.displayAvatarURL());
        // message.channel.send(embed);

        let embed =  {
            image: {
                url: message.author.defaultAvatarURL()
            },
            description: embedContent,
            thumbnail: {
                url: message.author.defaultAvatarURL()
            },
            timestap: new Date()
        }
        message.channel.send({ embed: embed});

    }

    else if(isValidCommand(message,"say")){
        let announceMessage = message.content.substring(5);
        let announcementChannelHardCode = bot.channels.cache.get('727986655574884433');
        let announceChannelFindByName = bot.channels.cache.find(channel => channel.name.toLowerCase() === "announce");
        if(announceChannelFindByName)
            announceChannelFindByName.send(announceMessage);
    }

    else if(isValidCommand(message,"ban")){
        console.log();
        
    }


});
        

// 
bot.login(process.env.BOT_TOKEN);
