import { Container, Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import PlayerCards from "../components/PlayerCards.js";
import DealerCards from "../components/DealerCards.js";

const socket = io.connect("https://vocal-squirrel-189068.netlify.app");//URL backend 3001

//Regex para validar un numero, seguido de un guion medio, seguido de una letra en mayuscula
const regex = new RegExp("^[0-9]+-[A-Z]$");

const GameView = () => {
    const [playerResult, setPlayerResult] = useState("");
    const [playersId, setPlayersId] = useState(["", "", "", ""]);
    const [buttonsEnabled, setButtonsEnabled] = useState(false);
    const [userPlaying, setUserPlaying] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [nickNames, setNickNames] = useState(["", "", "", ""]);
    const [userNickName, setUserNickName] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const navigate = useNavigate();

    const startGame = () => {
        socket.emit("start_game", { hostPlayer: socket.id });
        // setGameStarted(true);
        // setGameFinished(false);
        // setPlayerResult("");
    };

    const changeIdPlayers = (data) => {
        setPlayersId((prevState) => {
            let newPlayersId = [...prevState];
            let i = 0;
            while (i < data.playersId.length) {
                newPlayersId[i] = data.playersId[i];
                i++;
            }
            for (let j = 0; j < 4; j++) {
                let aux = newPlayersId[j];
                if (aux === socket.id) {
                    newPlayersId[j] = newPlayersId[0];
                    newPlayersId[0] = aux;
                }
            }
            return newPlayersId;
        });
    }

    const changeNickNames = (data) => {
        console.log(data.nickNames);
        setNickNames((prevState) => {
            let newNickNames = [...prevState];
            let i = 0;
            while (i < data.nickNames.length) {
                newNickNames[i] = data.nickNames[i];
                i++;
            }
            for (let j = 0; j < 4; j++) {
                let aux = newNickNames[j];
                if (aux === userNickName) {
                    newNickNames[j] = newNickNames[0];
                    newNickNames[0] = aux;
                }
            }
            return newNickNames;
        });
    }

    const hit = () => {
        socket.emit("request_card", {id: playersId[0]});
    }

    const stay = () => {
        if(userPlaying){
            console.log("player decided to stay");
            socket.emit("stay", {id: playersId[0]});
        }else{
            console.log("NO ESTOY JUGANDO AHORA");
        }
    }

    const leaveRoom = () => {
        navigate('/home');
        window.location.reload();
    }

    socket.on("receive_result_join", (data) =>{
        if(!data.result){
            console.log("no puedes jugar en esta sala");
            leaveRoom();
        }else{
            console.log("bienvenid@");
        }
    })

    socket.on("change_turn", (data) => {
        console.log("turno de: " + data.nextPlayer);
        if(data.nextPlayer === socket.id){
            setUserPlaying(true);
            setButtonsEnabled(true);
        }else{
            setUserPlaying(false);
            setButtonsEnabled(false);
        }
    });

    socket.on("can_play", (data) => {
        console.log("can hit: " + data.canHit);
        if(data.idPlayer === socket.id && !data.canHit){
            setButtonsEnabled(false);
            console.log("cannot play anymore");
            stay();
        }
    });

    socket.on("receive_ids", (data) => {
        setGameStarted(true);
        setGameFinished(false);
        setPlayerResult("");
        console.log("obtiene ids: " + data);
        changeIdPlayers(data);
    });

    socket.on("receive_nicknames", (data) => {
        console.log("obtiene nicks: " + data);
        changeNickNames(data);
    });

    socket.on("finish_game", (data) =>{
        setGameFinished(true);
        setGameStarted(false);
        data.playersId.forEach((element, index) => {
            if(element === socket.id){
                if(data.playersResults[index] == 1){
                    setPlayerResult("Ganaste");
                }else if(data.playersResults[index] == -1){
                    setPlayerResult("Perdiste");
                }else{
                    setPlayerResult("Empataste");
                }
            }
        });
    });

    useEffect(() => {
        socket.emit("join_game", {roomId: localStorage.getItem("roomId"), playerId: socket.id});
        setNickNames(() => {
            let newArray = [...nickNames]
            newArray[0] = (localStorage.getItem("nickName"));
            return newArray;
        });
        setUserNickName(localStorage.getItem("nickName"));
        socket.emit("add_nickname", {nick: localStorage.getItem("nickName")});
        console.log("finished useEffect");
    }, []);

    
    return (
        <Container fluid style={{
            backgroundColor: "#c8c2c2",
            minHeight: "500px",
            height: "100vh",
            minWidth: "800px",
        }}>
            <Row>
                <Col style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <h1>BlackJack</h1>
                </Col>
            </Row>
            <Row style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Col style={{
                    maxWidth: "500px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                }}>
                    <Button variant="primary" onClick={startGame} disabled={gameStarted}>
                        StartGame
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <h4>{playerResult}</h4>
                </Col>
            </Row>
            <Row>
                <Col style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                </Col>
            </Row>
            <Row style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
            }}>
                <Col xs={4} style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {nickNames[3]}
                    <PlayerCards socket={socket} idPlayer={playersId[3]} showCards={gameFinished} />
                </Col>
            </Row>
            <Row>
                <Col xs={4} style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {nickNames[2]}
                    <PlayerCards socket={socket} idPlayer={playersId[2]} showCards={gameFinished} />
                </Col>
                <Col xs={4} style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    Mesa
                    <DealerCards socket={socket} showCards={gameFinished} />
                </Col>
                <Col xs={4} style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {nickNames[1]}
                    <PlayerCards socket={socket} idPlayer={playersId[1]} showCards={gameFinished} />
                </Col>
            </Row>
            <Row style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Col xs={4} style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {nickNames[0]}
                    <PlayerCards socket={socket} idPlayer={playersId[0]} showCards={true} />
                    <Container style={{
                        maxWidth: "180px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "20px",
                    }}>
                        <Button variant="primary" onClick={hit} disabled={!buttonsEnabled}>
                            Pedir
                        </Button>
                        <Button variant="primary" onClick={stay} disabled={!buttonsEnabled}>
                            Plantarse
                        </Button>

                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default GameView;
