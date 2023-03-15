const express = require('express');
const app = express(); //Servidor express
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); //Cors permite conexiones más fáciles y evitar posibles errores

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",//URL frontend
        methods: ["GET", "POST"]
    }
});

var rooms = {};

function createRoom(roomId) {
    rooms[roomId] = {
        numberOfPlayers: 0,
        playersNickNames: [],
        playersId: [],
        playerPlaying: "",
        dealerSum: 0,
        playersSum,
        dealerAceCount: 0,
        playersAceCount,
        deck
    };
}

function joinRoom(roomId, playerId, playerNickName) {

    if (roomId in rooms) {
        //Verificar que #jugadores < 4 e ingresar a la sala
        if (rooms[roomId].numberOfPlayers > 3) {
            return false;
        }
    } else {
        //Crear nueva sala e ingresar
        createRoom(roomId);

    }
    console.log("antes de ingresar hay " + rooms[roomId].numberOfPlayers + " jugadores");
    //TODO agregar el nick
    //rooms[roomId].playersNicks.push();
    rooms[roomId].playersId.push(playerId);
    rooms[roomId].playersNickNames.push(playerNickName);
    rooms[roomId].numberOfPlayers += 1;
    return true;
}


var numberOfPlayers = 4;
var playersId = [];
var playersNickNames = [];
var playerPlaying = "";

var dealerSum = 0;
var playersSum;

var dealerAceCount = 0;
var playersAceCount;

var deck;

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    //socket.join("sala 1");
    // console.log(Object.keys(socket.rooms));
    playersId.push(socket.id);
    console.log(playersId);

    socket.on('disconnect', function () {
        console.log('Got disconnect!');
        //TODO eliminar de una sala el jugador
        var i = playersId.indexOf(socket.id);
        playersId.splice(i, 1);
        playersNickNames.splice(i, 1);
    });

    socket.on("join_game", (data) => {
        let result = joinRoom(data.roomId, data.playerId);
        socket.join(data.roomId);
        if(!result){
            socket.leave(data.roomId);
        }
        console.log("jugadores en sala: " + rooms[data.roomId].numberOfPlayers);
        socket.emit("receive_result_join", { result: result });
        const roomId = data.roomId;
        const room = rooms[roomId];
        socket.on("disconnect", () => {
            // Remove the player from the room
            const playerIndex = room.playersId.indexOf(socket.id);
            if (playerIndex >= 0) {
                room.playersNickNames.splice(playerIndex, 1);
                room.playersId.splice(playerIndex, 1);
                room.numberOfPlayers--;
            }
            if (room.numberOfPlayers === 0) {
                delete rooms[roomId];
            }
        });

        socket.on("add_nickname", (data) => {
            if(data.nick != null && data.nick != undefined){
                rooms[roomId].playersNickNames.push(data.nick);
            }
        });

        socket.on("start_game", (data) => {
            console.log("ids en " + roomId + ": " + room.playersId);
            io.in(roomId).emit("receive_ids", { playersId: room.playersId });
            for (let i = 0; i < room.playersNickNames.length; i++) {
                const nickName = room.playersNickNames[i];
                if(!nickName){
                    room.playersNickNames.splice(i, 1);
                }
            }
            io.in(roomId).emit("receive_nicknames", { nickNames: room.playersNickNames });
            startGame(roomId);
        });

        socket.on("request_card", (data) => {
            let card = addCard(data.id, roomId);
            let canHit = true;
            let playerSum = reduceAce(data.id, roomId);
            console.log("playerSum: " + playerSum);
            if (playerSum > 21) {
                console.log("Se pasó de 21");
                canHit = false;
            }
            io.in(roomId).emit("receive_card", { card: card, id: data.id });
            io.to(data.id).emit("can_play", { canHit: canHit, idPlayer: data.id })
        });

        socket.on("stay", (data) => {
            changeTurn(roomId);
        });


    });
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
});


function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    return deck;
    // console.log(deck);
}

function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
    //console.log(deck);
}

function startGame(roomId) {
    const room = rooms[roomId];
    room.deck = shuffleDeck(buildDeck());
    console.log('Deck of cards is ready');
    room.dealerSum = 0;
    room.dealerAceCount = 0;
    room.playersSum = Array(room.numberOfPlayers).fill(0);
    room.playersAceCount = Array(room.numberOfPlayers).fill(0);
    room.playerPlaying = "";

    let cardsToSend = [];
    for (let i = 0; i < room.numberOfPlayers; i++) {
        for (let j = 0; j < 2; j++) {
            card = addCard(room.playersId[i], roomId);
            cardsToSend.push([room.playersId[i], card]);
        }
    }
    console.log("roomId: " + roomId);
    io.in(roomId).emit("receive_initial_cards", { cards: cardsToSend });
    changeTurn(roomId);
    console.log("change turn, new player: " + room.playerPlaying);

    var dealerCards = [];
    for (let i = 0; i < 2; i++) {
        dealerCards.push(addCard("dealer", roomId));
    }
    console.log("2 primeras dealer: " + room.dealerSum);

    io.in(roomId).emit("receive_initial_dealer_cards", { cards: dealerCards });

    console.log("end of startGame");
}

function addCard(userId, roomId) {
    let card = rooms[roomId].deck.pop();
    if (userId != "dealer") {
        for (let i = 0; i < rooms[roomId].playersId.length; i++) {
            if (rooms[roomId].playersId[i] === userId) {
                rooms[roomId].playersSum[i] += getValue(card);
                rooms[roomId].playersAceCount[i] += checkAce(card);
            }
        }
    } else {
        rooms[roomId].dealerSum += getValue(card);
        rooms[roomId].dealerAceCount += checkAce(card);
    }
    return (card);
}

function changeTurn(roomId) {
    const room = rooms[roomId];
    if (room.playerPlaying === "") {
        room.playerPlaying = room.playersId[0];
    } else if (room.playerPlaying != "dealer") {
        let idPlayerPlaying = room.playersId.indexOf(room.playerPlaying);
        console.log("idPlayer playing before change: " + idPlayerPlaying);
        if (idPlayerPlaying < (room.numberOfPlayers - 1)) {
            room.playerPlaying = room.playersId[idPlayerPlaying + 1];
            //console.log("nuevo idPlayerPlaying: " + (idPlayerPlaying + 1));
            console.log("nuevo playerPlaying: " + room.playerPlaying);
            //return playersId[idPlayerPlaying + 1];
        } else {
            room.playerPlaying = "dealer";
            //return "dealer";
        }
    }
    io.in(roomId).emit("change_turn", { nextPlayer: room.playerPlaying });
    console.log("cambio de turno finalizado (1)");
    console.log("turno de: " + room.playerPlaying);
    if (room.playerPlaying === "dealer") {
        //console.log("turno del dealer");
        hitDealerCards(roomId);
    }
    console.log("cambio de turno finalizado (2)");
}

function hitDealerCards(roomId) {
    const room = rooms[roomId];
    console.log("Suma inicial del dealer: " + room.dealerSum);
    let maxValue = Math.floor(Math.random() * 3) + 15;
    var dealerCards = [];
    while (room.dealerSum < maxValue) {
        dealerCards.push(addCard("dealer", roomId));
        reduceAce("dealer", roomId);
        console.log("dealer sum: " + room.dealerSum);
    }
    io.in(roomId).emit("receive_dealer_cards", { cards: dealerCards });
    var playersResults = doPlayersWin(roomId);
    io.in(roomId).emit("finish_game", { playersResults: playersResults, playersId: room.playersId });
}

function doPlayersWin(roomId) {
    const room = rooms[roomId];
    playersId.forEach(element => {
        reduceAce(element, roomId);
    });
    reduceAce("dealer", roomId);

    var playersResults = Array(room.numberOfPlayers).fill(1);
    if (room.dealerSum > 21) {
        return playersResults;
    }
    for (let i = 0; i < playersResults.length; i++) {
        if (room.playersSum[i] > 21) {
            playersResults[i] = -1;
        }
        //both you and dealer <= 21
        else if (room.playersSum[i] == room.dealerSum) {
            playersResults[i] = 0;
        }
        else if (room.playersSum[i] > dealerSum) {
            playersResults[i] = 1;
        }
        else {
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

function reduceAce(playerId, roomId) {
    const room = rooms[roomId];
    if (playerId != "dealer") {
        let i = room.playersId.indexOf(playerId);
        while (room.playersSum[i] > 21 && room.playersAceCount[i] > 0) {
            room.playersSum[i] -= 10;
            room.playersAceCount[i] -= 1;
        }
        return room.playersSum[i];
    } else {
        while (room.dealerSum > 21 && room.dealerAceCount > 0) {
            room.dealerSum -= 10;
            room.dealerAceCount -= 1;
        }
        return room.dealerSum
    }
}

