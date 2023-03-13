import { Container, Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
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

    // const handleUpdateItems = (updates) => {
    //     setPlayersId(playersId.map((item, index) => {
    //         const update = updates.find(u => u.index === index);
    //         if (update) {
    //             // If this item has an update, return a new object with the updated value
    //             return { ...item, value: update.value };
    //         } else {
    //             // Otherwise, return the original item
    //             return item;
    //         }
    //     }));
    // };

    const changeArray = (data) => {
        const newArray = [...playersId];
        let i = 0;
        while (i < data.playersId.length) {
            //setPlayersId([...playersId]);
            newArray[i] = data.playersId[i];
            i++;
        }
        for (let j = 0; j < 4; j++) {
            let aux = newArray[j];
            if (aux === socket.id) {
                newArray[j] = newArray[0];
                newArray[0] = aux;
            }
        }
        //console.log("new array: " + newArray);
        //setPlayersId(newArray);
        return (newArray);
        // setPlayersId(() => {
        //     //playersId = new Array(4).fill("");
        //     let i = 0;
        //     while (i < data.playersId.length) {
        //         //setPlayersId([...playersId]);
        //         newArray[i] = data.playersId[i];
        //         i++;
        //     }
        //     for (let j = 0; j < 4; j++) {
        //         let aux = newArray[j];
        //         if (aux === socket.id) {
        //             newArray[j] = newArray[0];
        //             newArray[0] = aux;
        //         }
        //     }
        //     // console.log(playersId);
        //     return newArray;
        // });

    }

    const changeIdPlayers = (data) => {
        // setPlayersId(() => {
        //     let i = 0;
        //     while (i < data.playersId.length) {
        //         //setPlayersId([...playersId]);
        //         playersId[i] = data.playersId[i];
        //         i++;
        //     }
        //     for (let j = 0; j < 4; j++) {
        //         let aux = playersId[j];
        //         if (aux === socket.id) {
        //             playersId[j] = playersId[0];
        //             playersId[0] = aux;
        //         }
        //     }
        //     // console.log(playersId);
        //     return playersId;
        // });
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

    // useEffect(() => {
    //     console.log("UseEffect App.js");
    //     // socket.on("receive_message", (data) => {
    //     //     setMessageReceived(data.message);
    //     // });

    //     // socket.on("receive_ids", (data) => {
    //     //     // console.log("data: " + data.playersId);
    //     //     // setPlayersId([...changeArray(data)]);
    //     //     //changeArray(data);
    //     //     changeIdPlayers(data);
    //     //     // setPlayersId([...newArray]);
    //     //     // setPlayersId(() => {
    //     //     //     let i = 0;
    //     //     //     while (i < data.playersId.length) {
    //     //     //         playersId[i] = data.playersId[i];
    //     //     //         i++;
    //     //     //     }
    //     //     //     for (let j = 0; j < 4; j++) {
    //     //     //         let aux = playersId[j];
    //     //     //         if (aux === socket.id) {
    //     //     //             playersId[j] = playersId[0];
    //     //     //             playersId[0] = aux;
    //     //     //         }
    //     //     //     }
    //     //     //     // console.log(playersId);
    //     //     //     return playersId;
    //     //     // });
    //     //     // console.log("Array playersId luego de function: " + playersId);
    //     // });
    // }, [socket])
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
                    <PlayerCards socket={socket} idPlayer={playersId[3]} showCards={true} />
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
                    <PlayerCards socket={socket} idPlayer={playersId[2]} showCards={true} />
                </Col>
                <Col xs={4} style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    Mesa
                    <DealerCards socket={socket} />
                </Col>
                <Col xs={4} style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    Player 1
                    <PlayerCards socket={socket} idPlayer={playersId[1]} showCards={true} />
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
                    <PlayerCards socket={socket} idPlayer={playersId[0]} showCards={false} />
                    <Container style={{
                        maxWidth: "180px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                    }}>
                        <Button variant="primary" onClick={hit}>
                            Pedir
                        </Button>
                        <Button variant="primary" onClick={stay}>
                            Plantarse
                        </Button>

                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default GameView;
