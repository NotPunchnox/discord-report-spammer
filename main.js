const fs = require("fs");
const request = require("request");
var jsp = require("readline-sync");
jsp.setEncoding("utf8");
const gradient = require('gradient-string');
const proxyChecker = require('proxy-checker');
require('events').EventEmitter.defaultMaxListeners = 15;


console.clear();


if (!fs.existsSync("./proxy.txt")) {
  console.log(gradient.passion(`Il manque le fichier ${__dirname + "\\proxy.txt"}`));
  console.log(gradient.cristal("Creation du fichier proxy.txt en cours..."));
  fs.open("./proxy.txt", "w", function (err) {
      if (err) return console.error(gradient.fruit(`Erreur:\n${err}`));
    }),
    console.log(gradient.summer(`Le fichier ${__dirname + "\\proxy.txt"} a ete cree avec succes!`));
};
if (!fs.existsSync("./tokens.txt")) {
  console.log(gradient.passion(`Il manque le fichier ${__dirname + "\\tokens.txt"}`));
  console.log(gradient.cristal("Creation du fichier tokens.txt en cours..."));
  fs.open("./tokens.txt", "w", function (err) {
      if (err) return console.error(gradient.fruit(`Erreur:\n${err}`));
    }),
    console.log(gradient.summer(`Le fichier ${__dirname + "\\tokens.txt"} a ete cree avec succes!`));
};

function exit() {
  setTimeout(function () {
    process.exit();
  }, 10000);
};

const tokenArray = fs.readFileSync('./tokens.txt', 'utf-8').replace(/\r|\"/gi, '').split("\n");
const proxies = [];

console.log("Lancement du programme...");
console.log(gradient.cristal(`
 =================================
| Nombre de tokens trouve: ${tokenArray.length}      |
| Nombre de proxies trouve: ${fs.readFileSync('./proxy.txt', 'utf-8').replace(/\r|\"/gi, '').split("\n").length}   |
 =================================`));

const raison = jsp.question(gradient.morning(`
====================================
| PROXY SCRAPPER: ps               |
| Contenu illegal: 1               |
| Harcelement: 2                   |
| Spamming, malveillants [...]: 3  |
| Automutilation: 4                |
| Contenu nsfw: 5                  |
====================================

Reponse: `));

if (raison > 5 || raison == 0) return console.error(gradient.fruit("Parametres invalid! [1,2,3,4,5,ps]"));

if (raison === "ps") {
  request({
    method: "GET",
    url: "https://www.proxy-list.download/api/v1/get?type=http",
    json: true
  }, function (err, res, body) {
    if (err) return console.log(gradient.fruit(err));
    console.clear();
    console.log(gradient.cristal("Nombre de proxies genere: " + body.length));
    fs.writeFileSync("./proxy.txt", body);
    console.log(gradient.cristal("Liste de proxie genere avec succes dans le fichier proxy.txt!"));
    exit();
  });
} else {

  const guild = jsp.question(gradient.cristal("Veuillez specifier l'ID du serveur: \nReponse: "));
  if (!guild) return console.log(gradient.fruit("Parametres invalid! [ID du serveur]"));
  const channel = jsp.question(gradient.cristal("Veuillez specifier l'ID du salon: \nReponse: "));
  if (!channel) return console.log(gradient.fruit("Parametres invalid! [ID du salon]"));
  const message = jsp.question(gradient.cristal("Veuillez specifier l'ID du message: \nReponse: "));
  if (!message) return console.log(gradient.fruit("Parametres invalid! [ID du message]"));
  console.clear();
  const sltcv = {
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4
  };

  fs.readFile("./proxy.txt", "utf8", function (err, data) {
    if (!data) {
      if (err) return console.error(gradient.fruit(`Erreur:\n${err}`));
      console.error(gradient.fruit("Vous n'avez pas de proxies enregistre dans le fichier " + __dirname + "\\proxy.txt" + "Voulez vous continuer sans proxies ?"));
      const qsprx = jsp.question(gradient.cristal("(Vous pouvez recuperer des proxies avec la commande [ps])\nRepondre par y/n\nReponse: "));
      if (qsprx !== "y" && qsprx !== "n") return console.error(gradient.fruit("Parametres invalid! [y/n]")), exit();
      if (qsprx === "n") return exit();
      if (qsprx === "y") {
        setInterval(() => {
          var tokens = tokenArray[Math.floor(Math.random() * tokenArray.length)];
          request({
            method: "POST",
            url: "https://discord.com/api/v8/report",
            headers: {
              'authorization': tokens,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'channel_id': channel,
              'guild_id': guild,
              'message_id': message,
              'reason': sltcv[raison]
            })
          }, (err, res, body) => {
            var json = JSON.parse(body);
            if (json.code == 0) return console.error(gradient.fruit("Impossible d'effectuer la demande avec le token: " + tokens));
            if (json.code == 10003) return console.error(gradient.fruit("Le salon n'existe pas!"));
            if (json.code == 10008) return console.error(gradient.fruit("Le message n'existe pas!"));
            if (json.code == 40002) return console.error(gradient.fruit("Votre compte n'est pas verifie!"));
            //https://discord.com/developers/docs/resources/channel#get-channel pour plus d'informations à ce sujet!
            console.log(gradient.morning("Request message: " + body + "\nDemande effectue avec le token: " + tokens));
          });
        }, 500);
      }
    }
  });

  function checkproxy() {
    proxyChecker.checkProxiesFromFile('proxy.txt', {
      url: 'http://www.discord.com'
    }, (host, port, ok) => {
      if (ok) return proxies.push(`${host}:${port}`);
    });
  };

  checkproxy();


  console.log(gradient.cristal("Veuillez patienter le temps de verifier les proxies..."));
  setTimeout(function () {
    console.clear();
    console.log(gradient.morning(`Nombre de proxies valide: ${proxies.length}`));
    setInterval(() => {
      var tokens = tokenArray[Math.floor(Math.random() * tokenArray.length)];
      request({
        method: "POST",
        url: "https://discord.com/api/v8/report",
        proxies: `http://${proxies[Math.floor(Math.random() * proxies.length)]}`,
        headers: {
          'authorization': tokens,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'channel_id': channel,
          'guild_id': guild,
          'message_id': message,
          'reason': sltcv[raison]
        }),
      }, (err, res, body) => {
        if (err) return console.error(gradient.fruit(`Erreur:\n${err}`));
        if (!body) return;
        var json = JSON.parse(body);
        if (json.code == 0) return console.log(gradient.morning("Impossible d'effectuer la demande avec le token: " + tokens + " et le proxie: " + proxies[Math.floor(Math.random() * proxies.length)]));
        if (json.code == 10003) return console.error(gradient.fruit("Le salon n'existe pas!"));
        if (json.code == 10008) return console.error(gradient.fruit("Le message n'existe pas!"));
        if (json.code == 40002) return console.error(gradient.fruit("Votre compte n'est pas verifie!"));
        console.log(gradient.morning("Request message: " + body + "\nDemande effectue avec le token: " + tokens + "\nEt le proxie: " + proxies[Math.floor(Math.random() * proxies.length)]));
      });
    }, 500);
  }, 10000);
};