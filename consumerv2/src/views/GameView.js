import { Container, Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import { useState } from "react";
import io from 'socket.io-client';
import PlayerCards from "../components/PlayerCards.js";
import DealerCards from "../components/DealerCards.js";

const socket = io.connect("http://localhost:3001");//URL backend

//Regex para validar un numero, seguido de un guion medio, seguido de una letra en mayuscula
const regex = new RegExp("^[0-9]+-[A-Z]$");

const GameView = () => {
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("");
    const [playersId, setPlayersId] = useState(["", "", "", ""]);
    const [buttonsEnabled, setButtonsEnabled] = useState(false);
    const [userPlaying, setUserPlaying] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);

    const sendMessage = () => {
        socket.emit("send_message", { message });
    };

    const startGame = () => {
        socket.emit("start_game", { hostPlayer: socket.id });
        setGameFinished(false);
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

    const hit = () => {
        socket.emit("request_card", {id: playersId[0]});
    }

    const stay = () => {
        //TODO desactivación de botones
        if(userPlaying){
            console.log("player decided to stay");
            socket.emit("stay", {id: playersId[0]});
        }
    }


    socket.on("receive_message", (data) => {
        setMessageReceived(data.message);
    });

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
        if(!data.canHit){
            setButtonsEnabled(false);
            console.log("cannot play anymore");
            stay();
        }
    });

    socket.on("receive_ids", (data) => {
        changeIdPlayers(data);
    });

    socket.on("finish_game", (data) =>{
        setGameFinished(true);
        data.playersId.forEach((element, index) => {
            if(element === socket.id){
                if(data.playersResults[index] == 1){
                    setMessageReceived("Ganaste");
                }else if(data.playersResults[index] == -1){
                    setMessageReceived("Perdiste");
                }else{
                    setMessageReceived("Empataste");
                }
            }
        });
    });

    
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
                    <h1>Game View</h1>
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
                    gap: "10px",
                }}>
                    <InputGroup>
                        <FormControl placeholder="Message" aria-label="Message" aria-describedby="basic-addon1"
                            value={message} onChange={(e) => { setMessage((e.target.value.trim()).toUpperCase()); }}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }} />
                    </InputGroup>
                    <Button variant="primary" onClick={sendMessage}>
                        SendMessage
                    </Button>
                    <Button variant="primary" onClick={startGame}>
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
                    Message: {messageReceived}
                </Col>
            </Row>
            <Row>
                <Col style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    PlayersID: {playersId.toString()}
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
                    Player 3
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
                    Player 2
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
                    Player 1
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
                    Player 0
                    <PlayerCards socket={socket} idPlayer={playersId[0]} showCards={true} />
                    <Container style={{
                        maxWidth: "180px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
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
