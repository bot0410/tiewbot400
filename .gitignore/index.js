const Discord = require('discord.js');
const fs = require('fs')
const client = new Discord.Client();


var prefix = "_";

const warns = JSON.parse(fs.readFileSync('./warns.json'))


client.login('NTMwNDE3NDk1OTgzNTIxNzky.DzS5Tg.0eeONE2Kn0_M2iASyRM_rBMmcko')

client.on('guildMemberAdd', member =>{
    let embed = new Discord.RichEmbed()
        .setDescription(':tada: **' + member.user.username + '** a rejoint ' + member.guild.name)
        .setFooter('Nous sommes désormais ' + member.guild.memberCount)
    member.guild.channels.get('530406367937298452').send(embed)
    member.addRole('540135134238736386')
 
});
 
client.on('guildMemberRemove', member =>{
    let embed = new Discord.RichEmbed()
        .setDescription(' Oh non ' + member.user.username + ' est partie à bientôt :confused: ! ' + member.guild.name)
        .setFooter('Nous sommes désormais ' + member.guild.memberCount)
    member.guild.channels.get('530406367937298452').send(embed)
});

/*Kick*/
client.on('message',message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLocaleLowerCase() === prefix + 'kick'){
       if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas kick cet utilisateur :x:")
       if (!member.kickable) return message.channel.send("Je ne peux pas exclure cet utilisateur :sunglass:")
       member.kick()
       message.channel.send("**"+member.user.username + '** a été exclu :white_check_mark:')
    }
});
 
/*Ban*/
client.on('message',message =>{
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLocaleLowerCase() === prefix + 'ban'){
       if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:")
       message.guild.ban(member, {days: 7})
       message.channel.send("**"+member.user.username + '** a été banni :white_check_mark:')
    }
});

client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLocaleLowerCase() === prefix + "warn") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande") 
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre")
        let reason = args.splice(2).join(' ')
        if (!reason) return message.channel.send("Veuillez indiquer une raison")
        message.author.createDM.then
        if (!warns[member.id]) {
            warns[member.id] = []
            message.author.createDM().then(channel => {
                channel.send('Vous avez warn un membre il sera vérifié plus tard')
            })
        }
        warns[member.id].unshift({
            reason: reason,
            date: Date.now(),
            mod: message.author.id
        })
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send(member + " a été warn pour " + reason + " :white_check_mark:")
    }
    if (args[0].toLocaleLowerCase() === prefix + "infraction") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez un membre")
        let embed = new Discord.RichEmbed()
        .setAuthor(member.user.username, member.user.displayAvatarURL)
        .addField('10 derniers warns', (warns[member.id]) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warn")
        .setTimestamp()
        message.channel.send(embed)
    }
})

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    
    if (args[0].toLocaleLowerCase() === prefix + '8ball'){
        if (!args[1]) return message.channel.send("Veuillez **poser une question** :x:")
        let rep = ["Non :x:", "Oui :white_check_mark:", "Balec :face_palm:", "Peut être... :thinking:"];
        let reptaille = Math.floor((Math.random() * rep.length));
        let question = args.slice(0).join(" ");

        let embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag)
            .setColor("ORANGE")
            .addField("Question:", question)
            .addField("Réponse:", rep[reptaille]);
        message.channel.send(embed)
    }
})

client.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "clear") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let count = args[1]
        if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer")
        if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide")
        if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100")
        message.channel.bulkDelete(parseInt(count) + 1)
    }

    if (args[0].toLowerCase() === prefix + "mute") {
        if (!message.member.hasPermission('MANAGE_MESSAGE')) return message.author.createDM().then(channel => {
            channel.send("Vous n'avez pas la permission d'utiliser cette comande")
        })
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez un membre")
        if (!member) return message.channel.send("Membre introuvable")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre")
        if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne peux pas mute ce membre")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + ' a été mute :white_check_mark:')
        }
        else {
            message.guild.createRole({name: 'Muted', permissions: 0}).then((role) => {
                message.guild.channels.filter(channel => channel.type === 'text').forEach(channel => {
                    channel.overwritePermissions(role, {
                        SEND_MESSAGES: false
                    })
                })
                member.addRole(role)
                message.channel.send(member + ' a été mute :white_check_mark:')
            })
        }
    }
})

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "couscous") {
        message.author.createDM().then(channel => {
            channel.send('CE SOIR ON MANGE COUSCOUS AVEC LA FAMILLE!')
        })
    }
})

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "méchant bot") {
        message.channel.send("peut être que je suis méchant mais toi tes débile")
    }
})

client.on('message',message => {
    if(message.content === "méchant bot"){
        message.reply('peut être que je suis méchant mais toi tes débile')
    }
});

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "admin") {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Vous n'avez pas la permission de vous giver un grade")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez un membre")
        if (!member) return message.channel.send("Membre introuvable")
        let muterole = message.guild.roles.find(role => role.name === '👌Administrateur👌')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + 'vous avez le grade Administrateur')
        }
    }
})

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "modérateur") {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Vous n'avez pas la permission de vous giver un grade")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez un membre")
        if (!member) return message.channel.send("Membre introuvable")
        let muterole = message.guild.roles.find(role => role.name === '🏹Modérateur🏹')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + 'vous avez le grade Modérateur')
        }
    }
})

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "développeur") {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Vous n'avez pas la permission de vous giver un grade")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez un membre")
        if (!member) return message.channel.send("Membre introuvable")
        let muterole = message.guild.roles.find(role => role.name === '🔧Développeur🔧')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + 'vous avez le grade 🔧Développeur🔧')
        }
    }
})

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "chef") {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Vous n'avez pas la permission de vous giver un grade")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez un membre")
        if (!member) return message.channel.send("Membre introuvable")
        let muterole = message.guild.roles.find(role => role.name === '⚔️Chef⚔️')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + 'vous avez le grade ⚔️Chef⚔️')
        }
    }
})

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "vip") {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Vous n'avez pas la permission de vous giver un grade")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez un membre")
        if (!member) return message.channel.send("Membre introuvable")
        let muterole = message.guild.roles.find(role => role.name === '🔥V.I.P🔥')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + 'vous avez le grade 🔥V.I.P🔥')
        }
    }
})

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "amis") {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Vous n'avez pas la permission de vous giver un grade")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez un membre")
        if (!member) return message.channel.send("Membre introuvable")
        let muterole = message.guild.roles.find(role => role.name === '👥Amis👥')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + 'vous avez le grade 👥Amis👥')
        }
    }
})

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "reporteur") {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Vous n'avez pas la permission de vous giver un grade")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez un membre")
        if (!member) return message.channel.send("Membre introuvable")
        let muterole = message.guild.roles.find(role => role.name === '🔴 REPORTEUR🔴')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + 'vous avez le grade 🔴 REPORTEUR🔴')
        }
    }
})

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "relou") {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Vous n'avez pas la permission de vous giver un grade")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez un membre")
        if (!member) return message.channel.send("Membre introuvable")
        let muterole = message.guild.roles.find(role => role.name === '🔎Relou🔍')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + 'vous avez le grade 🔎Relou🔍')
        }
    }
})

client.on('message',message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "testeur") {
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("Vous n'avez pas la permission de vous giver un grade")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionnez un membre")
        if (!member) return message.channel.send("Membre introuvable")
        let muterole = message.guild.roles.find(role => role.name === '📚Testeur📚')
        if (muterole) {
            member.addRole(muterole)
            message.channel.send(member + 'vous avez le grade 📚Testeur📚')
        }
    }
})

gdgdfgfgfd