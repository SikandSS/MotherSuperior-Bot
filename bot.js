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

    
        
});
        

// 
bot.login(process.env.BOT_TOKEN);
