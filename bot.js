// 
require("dotenv").config();
const PREFIX = process.env.PREFIX;
const discord = require("discord.js");
const bot = new discord.Client();
const config = require("./config/config.json");

// 
bot.on("ready", () => {
    console.log(`${bot.user.tag} has logged in.`);
    bot.user.setActivity("Prefix ?",{type:"STREAMING"});
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

    // Used for ignoring the things said by other bots or potentially our bot.
    // Security feature from ?say command being used maliciously. for example ?say kick
    if(message.author.bot) return;


    // 
    // Syntax :?hello
    if(isValidCommand(message,"hello")){
        message.reply("Hello!");
    }

    // 
    // Syntax:?rolldice
    else if(isValidCommand(message, "rolldice")) {
        message.reply("rolled a " + rolldice());
    }


    // Defining Command to add roles
    // Syntax:?add test
    //       :?add test, test1, test2, test3
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


    // 
    // Syntax:?del test
    //       :?del test, test1, test2
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
    
    // Defining embed command. Skeleton code for server and userinfo.
    // commented out portion is embed implementation using JSON
    // Comment out other part of code and uncomment the commented part for JSON implementation.
    // Syntax:?embed text_here
    else if(isValidCommand(message, "embed")){
        let embedContent = message.content.substring(7);
        let embed = new discord.MessageEmbed();
        embed.addField("Message", embedContent);
        embed.setColor("#63d6ff");
        embed.setTitle("New embed Message Create");
        embed.setTimestamp();
        embed.setImage(message.author.displayAvatarURL());
        embed.setAuthor(message.author.tag,message.author.displayAvatarURL());
        embed.setThumbnail(message.author.displayAvatarURL());
        message.channel.send(embed);

        // let embed =  {
        //     image: {
        //         url: message.author.defaultAvatarURL()
        //     },
        //     description: embedContent,
        //     thumbnail: {
        //         url: message.author.defaultAvatarURL()
        //     },
        //     timestap: new Date()
        // }
        // message.channel.send({ embed: embed});

    }

    else if(isValidCommand(message,"say")){
        let announceMessage = message.content.substring(5);
        let announcementChannelHardCode = bot.channels.cache.get('727986655574884433');
        let announceChannelFindByName = bot.channels.cache.find(channel => channel.name.toLowerCase() === "announce");
        if(announceChannelFindByName)
            announceChannelFindByName.send(announceMessage);
    }

    // Defining ban command. Bans with the use of USER_ID
    else if(isValidCommand(message,"ban")){
        if(!message.member.hasPermission("BAN_MEMBERS")){
            message.channel.send("You don't have have permission to use that command.");

        }
        else {
            let memberid = message.content.substring(message.content.indexOf(" ") + 1);
            try {

                let bannedMember =  message.guild.members.ban(memberid);
            if(bannedMember) {
                console.log( bannedMember.tag + " was banned.");
                
            }
            else {
                console.log("Ban did not happen.");
                
            }

            }
            catch(err) {
                console.log(err);
                
            }
            

        }
        
            
    }

    // Defining kick command. Kicks user with their USER_ID
    else if(isValidCommand(message,"kick")){
        if(!message.member.hasPermission("KICK_MEMBERS")){
            message.channel.send("You can't do that.")
        }
        else{
            
            try {
                let memberid = message.content.substring(6);
                let member = message.guild.members.cache.get(memberid);
                if(member){
                     member.kick();
                    console.log("A member was kicked.");
                }
                else{
                    console.log("kick did not happen");
                    
                }
                
            } catch (err) {
                console.log(err);
                
            }
        }
    }

    // Defining mute command
    else if(isValidCommand(message,"mute")){
        if(!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])){
            message.channel.reply("You do not have the permission to say that command");
        }
        else{
            let memberid = message.content.substring(message.content.indexOf(" ") + 1);
            let member = message.guild.members.cache.get(memberid);
            if(member) {
                if(member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']) && !message.member.hasPermission("ADMINISTRATOR")) {
                    message.channel.send("You cannot mute that person");
                }
                else{
                    let mutedRole = member.guild.roles.cache.get('728218506130358314');
                    if(mutedRole){
                        member.roles.add(mutedRole);
                     message.channel.send("User was muted.");
                    }
                    else{
                        message.channel.send("Role not found.");
                    }
                     
                }
            }
            else{
                message.channel.send("Member not found.")
            }
        }
    }


    else if(isValidCommand(message,"unmute")){
        if(!message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS'])){
            message.channel.reply("You do not have the permission to say that command");
        }
        else{
            let memberid = message.content.substring(message.content.indexOf(" ") + 1);
            let member = message.guild.members.cache.get(memberid);
            if(member) {
                if(member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']) && !message.member.hasPermission("ADMINISTRATOR")) {
                    message.channel.send("You cannot unmute that person");
                }
                else{
                    let mutedRole = member.guild.roles.cache.get('728218506130358314');
                    if(mutedRole){
                        member.roles.remove(mutedRole);
                     message.channel.send("User was unmuted.");
                    }
                    else{
                        message.channel.send("Role not found.");
                    }
                     
                }
            }
            else{
                message.channel.send("Member not found.")
            }
        }

    }


    
        
    


});
        

// BOT login through environmental variable using npm package dotenv.
bot.login(process.env.BOT_TOKEN);
