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

    socket.on("send_message", (data) => {
        socket.broadcast.emit("recieve_message", data);
    });
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
});