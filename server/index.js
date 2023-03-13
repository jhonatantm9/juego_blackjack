const express = require('express');
const app = express(); //Servidor express
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors"); //Cors permite conexiones más fáciles y evitar posibles errores
const { setTimeout } = require('timers/promises');

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",//URL frontend
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    playersId.push(socket.id);
    console.log(playersId)

    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data);
    });

    socket.on('disconnect', function() {
        console.log('Got disconnect!');
  
        var i = playersId.indexOf(socket.id);
        playersId.splice(i, 1);
     });

    socket.on("start_game", (data) =>{
        io.emit("receive_ids", {playersId: playersId});
        //wait(1000);
        //setTimeout(startGame(), 1000);        
        startGame();
    });

    socket.on("request_card", (data) => {
        let card = addCard(data.id);
        let canHit = true;
        let playerSum = reduceAce(data.id);
        console.log("playerSum: " + playerSum);
        if (playerSum > 21) {
            console.log("Se pasó de 21");
            canHit = false;
        }
        io.emit("receive_card", {card: card, id: data.id});
        io.to(data.id).emit("can_play", {canHit: canHit})
        // io.to(socket.id).emit("receive_card", {card: card});
        // socket.broadcast.emit("add_card", {playerId: socket.id});
    });

    socket.on("stay", (data) => {
        // let nextPlayer = changeTurn(data.id);
        changeTurn();
        // if(nextPlayer === "dealer"){
        //     //let dealerCards = hitDealerCards();
        //     hitDealerCards();
        //     // io.emit("receive_dealer_cards", {cards: dealerCards});
        //     //let playersResults = doPlayersWin();
        // }
    });
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
});

//---- GAME LOGIC ----

var numberOfPlayers = 4;
var playersId = [];
var playerPlaying = "";

var dealerSum = 0;
var playersSum;

var dealerAceCount = 0;
var playersAceCount;

var deck;

//var canHit = true; //allows the player (you) to draw while yourSum <= 21

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    //console.log(deck);
}

function startGame() {
    buildDeck();
    shuffleDeck();
    console.log('Deck of cards is ready');

    numberOfPlayers = playersId.length;
    console.log("jugadores: " + numberOfPlayers);
    dealerSum = 0;
    playersSum = Array(numberOfPlayers).fill(0);
    playersAceCount = Array(numberOfPlayers).fill(0);
    playerPlaying = "";

    // console.log(hidden);
    console.log(dealerSum);
    // while (dealerSum < 17) {
    //     //<img src="./cards/4-C.png">
    //     addCard("dealer-cards");
    // }
    // console.log(dealerSum);
    let cardsToSend = [];
    for(let i = 0; i < numberOfPlayers; i++){
        for (let j = 0; j < 2; j++) {
            card = addCard(playersId[i]);
            cardsToSend.push([playersId[i], card]);
            //io.emit("receive_card", {card: card, id: playersId[i]});
        }
    }
    io.emit("receive_initial_cards", {cards: cardsToSend});
    changeTurn();
    console.log("change turn, new player: " + playerPlaying);

    var dealerCards = [];
    for (let i = 0; i < 2; i++) {
        dealerCards.push(addCard("dealer"));        
    }
    //reduceAce("dealer");
    console.log("2 primeras dealer: " + dealerSum);
    console.log(dealerCards.length);

    io.emit("receive_initial_dealer_cards", {cards: dealerCards});

    console.log("end of startGame");

}

function addCard(userId){
    let card = deck.pop();
    if(userId != "dealer"){
        for(let i = 0; i < playersId.length; i++){
            if(playersId[i] === userId){
                playersSum[i] += getValue(card);
                playersAceCount[i] += checkAce(card);
                // console.log("card added to player " + playersId[i] + ", card value: " + card);
                // console.log("puntaje: " + playersSum[i]);
            }
        }
    }else{
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
    }
    return(card);
}

function changeTurn(){
    if(playerPlaying === ""){
        playerPlaying = playersId[0];
        //return playersId[0];
    }else if(playerPlaying != "dealer"){
        let idPlayerPlaying = playersId.indexOf(playerPlaying);
        console.log("idPlayer playing before change: " + idPlayerPlaying);
        if(idPlayerPlaying < (numberOfPlayers - 1)){
            playerPlaying = playersId[idPlayerPlaying + 1];
            //console.log("nuevo idPlayerPlaying: " + (idPlayerPlaying + 1));
            console.log("nuevo playerPlaying: " + playerPlaying);
            //return playersId[idPlayerPlaying + 1];
        }else{
            playerPlaying = "dealer";
            //return "dealer";
        }
    }
    io.emit("change_turn", {nextPlayer: playerPlaying});
    console.log("cambio de turno finalizado (1)");
    if(playerPlaying === "dealer"){
        console.log("turno del dealer");
        hitDealerCards();
    }    
    console.log("cambio de turno finalizado (2)");
}

function hit() {
    if (!canHit) {
        return;
    }

    addCard("your-cards");

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

}

function hitDealerCards(){
    console.log("Suma inicial del dealer: " + dealerSum);
    let maxValue = Math.floor(Math.random() * 3) + 15;
    var dealerCards = []
    while (dealerSum < maxValue) {
        dealerCards.push(addCard("dealer"));
        reduceAce("dealer");
        console.log("dealer sum: " + dealerSum);
    }
    //return dealerCards;
    io.emit("receive_dealer_cards", {cards: dealerCards});
    var playersResults = doPlayersWin();
    // var winners = {playersId[0]: playersResults[0]};
    // playersResults.forEach((element, index) => {
    //     playersResults[index] = {}
    // })
    io.emit("finish_game", {playersResults:playersResults, playersId: playersId});
}

function doPlayersWin(){
    playersId.forEach(element => {
        reduceAce(element);
    });
    reduceAce("dealer");
    
    var playersResults = Array(numberOfPlayers).fill(1);
    if(dealerSum > 21){
        return playersResults;
    }
    for (let i = 0; i < playersResults.length; i++) {
        if (playersSum[i] > 21) {
            playersResults[i] = -1;
        }
        //both you and dealer <= 21
        else if (playersSum[i] == dealerSum) {
            playersResults[i] = 0;
        }
        else if (playersSum[i] > dealerSum) {
            playersResults[i] = 1;
        }
        else{
            playersResults[i] = -1;
        }
    }
    return playersResults;
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerId) {
    if(playerId != "dealer"){
        let i = playersId.indexOf(playerId);
        //let playerSum = playersSum[i];
        //let playerAceCount = playersAceCount[i];
        while (playersSum[i] > 21 && playersAceCount[i] > 0) {
            playersSum[i] -= 10;
            playersAceCount[i] -= 1;
        }
        return playersSum[i];
    }else{
        while (dealerSum > 21 && dealerAceCount > 0) {
            dealerSum -= 10;
            dealerAceCount -= 1;
        }
        return dealerSum
    }
}
