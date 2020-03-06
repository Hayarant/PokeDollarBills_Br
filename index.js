require('dotenv').config();
const Discord = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
    msg.channel.send('pong');

  } else if (msg.content.startsWith('!kick')) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
    } else {
      msg.reply('Please tag a valid user!');
    }
  }
});

bot.on('message', async msg => {
  if (msg.content === '!cotacao') {
    const request = require('request');
    const formatCurrency = require('format-currency')
    request('http://cotacoes.economia.uol.com.br/cambioJSONChart.html?type=d&cod=BRL&mt=off', { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      // msg.channel.send(body.url);
      var cotacao = formatCurrency(body[2].bid);
      var pokedex = String(cotacao);
      cotacao = String(cotacao)

      cotacao = cotacao.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ',');
      pokedex = pokedex.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

      var id = parseInt(pokedex);
      id = id -1;

      let rawdata = fs.readFileSync('pokedex.json');
      let student = JSON.parse(rawdata);
      var caminho = 'images/' + pokedex + '.png'
      msg.channel.send("Valor Dolar: " + "R$ "+ cotacao);
      msg.channel.send("Pokedex: " + "#" + pokedex + ' - ' + student[id].name.english );
      msg.channel.send({files: [caminho]});

    });
  }

});
