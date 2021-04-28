//Buttons
const startBtn = document.getElementById('startBtn');
const matchesBtn = document.getElementById('matchesBtn');
const loggedBtn = document.getElementById('loggedBtn')
const { remote } = require('electron');
const { Menu } = remote;
const { URLSearchParams } = require('url');
// imports
const LCUConnector = require('lcu-connector');
const mongoose = require ('mongoose');
require('dotenv').config()

//conection to data base
// '<ADD CONECTION STRING TO .ENV FILE>' (check .env_sample)
const connectionString = process.env.CONECTION_STRING;
var matchController = require ('./controller/match')
var timeLineController = require ('./controller/timeline')


let conector = mongoose.connect(connectionString)
        .then((res)=>{
            console.log(res)
            console.log("DataBase Online...🐱‍👤");
            // server creation
            });
//------------------------------------------

const connector = new LCUConnector('');
var protocol;
var address;
var username;
var password;
var authToken;
var logged = false;
var ready = false;
var games = [];
var lista = [];
var patch = "";
var listOnDb = []

//buttons start disabled
matchesBtn.disabled = true
loggedBtn.style.display = 'none'
document.getElementById("gamesUploaded").style.display = 'none'
document.getElementById("finished").style.display = 'none'
document.getElementById("loading").style.display = 'none'

matchesBtn.onclick = e =>{

    document.getElementById("loading").style.display = 'block'
    matchsFromDb();

}

startBtn.onclick = e => {
    connectLcu();

    
}





function connectLcu (){    

    connector.on('connect', async (lcuInfo) => {
        loggedBtn.style.display = 'block'
        //set info to global values
        protocol = lcuInfo.protocol;
        address = lcuInfo.address;
        port = lcuInfo.port;
        username = lcuInfo.username;
        password = lcuInfo.password;
        authToken = `Basic ${(Buffer.from(`${username}:${password}`)).toString('base64')}`;
        console.log(`username: ${username}`);
        console.log(`username: ${password}`);        
        console.log(lcuInfo);
        logged = true;
        matchesBtn.disabled = false
        return lcuInfo, loggedBtn.classList.remove('is-loading');
    })
    connector.start();
    

       
}

async function matchsFromDb(){
    getPach()
    await matchController.getMatchs().then(res=>{
        let listado = []
            res.forEach(element => {
                listado.push(element.game)
            })
        console.table(listado);
        listOnDb = listado;
        return listado;
    }).then(()=>{
        getMatches()
    })
}
//Matchlist is currently deprecated i have to wait for Riot to implement the new client, release date is not public yet.
function getMatches(){
    if(!ready){
        fetch(`https://${address}:${port}/lol-match-history/v1/matchlist`, {
			rejectUnauthorized: false,
			method: "GET",
			headers: {
				Authorization: authToken,
				Accept: "application/json"
			}
        }).then(function(response){
            console.log(response)
            return response.json();
        }).then(function(data){
            console.log(data)
            games = data.games;
            for (i in games.games){
                lista.push(games.games[i]);
            }
            ready = true;
            return games;
        }).then(()=>{
            uploadGames();
        })
    }
}

//lol-acs plugin could work, but it seems it's also not available at the moment.
function getMatchesv2(){
    var accountId = '';
    if(!ready){
        fetch(`https://${address}:${port}/lol-summoner/v1/current-summoner`, {
            method: "GET",
            headers: {
                Authorization: authToken,
                Accept: "application/json"
            }
        }).then(function(response){
            return response.json();
        }).then(function(data){
            accountId = data.accountId;
        }).then(()=>{
            fetch(`https://${address}:${port}/lol-acs/v2/matchlist?` + new URLSearchParams({
                accountId: accountId,
                begindex: 1,
                endindex: 10
            }), {
                rejectUnauthorized: false,
                method: "GET",
                headers: {
                    Authorization: authToken,
                    Accept: "application/json"
                }
            }).then(function(response){
                console.log(response)
                return response.json();
            }).then(function(data){
                console.log(data)
                games = data.games;
                for (i in games.games){
                    lista.push(games.games[i]);
                }
                ready = true;
                return games;
            }).then(()=>{
                uploadGames();
            })
        })
    }
}
function getPach(){
        fetch(`https://${address}:${port}/lol-patch/v1/game-version`, {
        rejectUnauthorized: false,
        method: "GET",
        headers: {
            Authorization: authToken,
            Accept: "application/json"
        }
        }).then(res=>{
            return res.json();
        }).then(data=>{
            let division = data.split("+")
            patch = division[0];
            console.log(patch)
            return patch;
        }).then(res=>{
            if(res){
                if(document.getElementById("patchTitle").innerHTML == "Patch: "){
                    document.getElementById("patchTitle").innerHTML += patch;
                    
                }

            }            
        })
    }


function getGame(gameId){
    fetch(`https://${address}:${port}/lol-match-history/v1/games/${gameId}`, {
        rejectUnauthorized: false,
        method: "GET",
        headers: {
            Authorization: authToken,
            Accept: "application/json"
        }
    }).then(res=>{
        return res.json();
    }).then(data=>{
        conector.then(async()=>{
            matchController.saveMatch(data);
        }).catch(e=>{console.log(e)});
        console.log(data);
    })
}
function getGameTimelines(gameIdd){
    fetch(`https://${address}:${port}/lol-match-history/v1/game-timelines/${gameIdd}`, {
        rejectUnauthorized: false,
        method: "GET",
        headers: {
            Authorization: authToken,
            Accept: "application/json"
        }
    }).then(res=>{
        return res.json();
    }).then(data=>{
        var gameId =gameIdd;
        data.gameId = gameId;        
        console.log("🐱‍👤🧉");
        console.log(data);
        conector.then(async()=>{
            timeLineController.saveTimeLine(data);
        }).catch(e=>{console.log(e)});
    })
    
}

function uploadGames(){
    let gameIds = [];
    let numberOfGamesUploaded = 0;
    for (i in listOnDb){
        gameIds.push(listOnDb[i].gameId);
    };
    for (i in lista){
        if (lista[i].gameType == "CUSTOM_GAME" && typeof gameIds.find((e)=>e === lista[i].gameId) === "undefined"){
           getGame(lista[i].gameId);
           getGameTimelines(lista[i].gameId);
            console.log(lista[i].gameId+"juego subido 🍕🍕🍕");
            numberOfGamesUploaded ++;
        }
    };
    if(document.getElementById("gamesUploaded").innerHTML == "Partidas subidas: "){
        document.getElementById("gamesUploaded").innerHTML += numberOfGamesUploaded;
        document.getElementById("gamesUploaded").style.display = 'block';
    }
    document.getElementById("loading").style.display = 'none';
    document.getElementById("finished").style.display = 'block';  
    matchsFromDb();
}


