const express = require('express');
const app = express(); //Servidor express
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors"); //Cors permite conexiones más fáciles y evitar posibles errores

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
        startGame();
        for(let i = 0; i < playersId.length; i++){
            for (let j = 0; i < 2; i++) {
                // card = addCard(playersId[i]);
                // io.to(playersId[i]).emit("initial_card", {card: card});
            }
        }
        io.emit("receive_ids", {playersId: playersId});
    });

    socket.on("request_card", (data) => {
        card = addCard(data.id);
        io.emit("receive_card", {card: card, id: data.id});
        // io.to(socket.id).emit("receive_card", {card: card});
        // socket.broadcast.emit("add_card", {playerId: socket.id});
    });
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
});

//---- GAME LOGIC ----

var numberOfPlayers = 4;
var playersId = [];

var dealerSum = 0;
var playersSum;

var dealerAceCount = 0;
var playersAceCount;

var hidden;
var deck;

var canHit = true; //allows the player (you) to draw while yourSum <= 21

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
    console.log(deck);
}

function startGame() {
    buildDeck();
    shuffleDeck();
    console.log('Deck of cards is ready');

    playersSum = Array(numberOfPlayers).fill(0);
    playersAceCount = Array(numberOfPlayers).fill(0);
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    // console.log(hidden);
    console.log(dealerSum);
    // while (dealerSum < 17) {
    //     //<img src="./cards/4-C.png">
    //     addCard("dealer-cards");
    // }
    // console.log(dealerSum);
    for(let i = 0; i < numberOfPlayers; i++){
        for (let j = 0; i < 2; i++) {
            card = addCard(playersId[i]);
            io.emit("receive_card", {card: card, id: playersId[i]});
        }
    }

    //console.log(yourSum);
    //document.getElementById("hit").addEventListener("click", hit);
    //document.getElementById("stay").addEventListener("click", stay);

}

function addCard(userId){
    let card = deck.pop();
    for(let i = 0; i < playersId.length; i++){
        if(playersId[i] === userId){
            playersSum[i] += getValue(card);
            playersAceCount[i] += checkAce(card);
        }
    }
    return(card);
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

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    }
    else if (dealerSum > 21) {
        message = "You win!";
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
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

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}
