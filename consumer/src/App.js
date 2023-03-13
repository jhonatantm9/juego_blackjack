import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from "react";
import PlayerCards from './components/PlayerCards.js';
import DealerCards from './components/DealerCards.js';
import { Card, Button, Container, Row, Col, Image } from 'react-bootstrap';

const socket = io.connect("http://localhost:3001");//URL backend

function App() {
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
        <div className="App">
            <input
                placeholder='Mesage...'
                onChange={(event) => {
                    setMessage(event.target.value);
                }}
                onKeyUp={(event) => {
                    if (event.key === "Enter") {
                        sendMessage();
                    }
                }}
            />
            <Button onClick={sendMessage}>Send Message</Button>
            <Button onClick={startGame}>Start Game</Button>
            <h1>Message:</h1>
            {messageReceived}
            <h4>PlayersId: {playersId.toString()}</h4>
            <Container>
                <Row className="justify-content-md-center mt-1 mb-4">
                    <Col sm={4}>
                        <Container className="mx-auto d-flex" style={{ width: "40%" }}>
                            <Row>
                                <Col>
                                    F1C1
                                    <PlayerCards socket={socket} idPlayer={playersId[3]} showCards={gameFinished} />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
                <Row className="mx-auto d-flex mb-4">
                    <Col md={4}>
                        <Container className="mx-auto d-flex" style={{ width: "40%" }}>
                            <Row>
                                <Col>
                                    F2C1
                                    <PlayerCards socket={socket} idPlayer={playersId[2]} showCards={gameFinished}></PlayerCards>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col md={4}>
                        <Container className="mx-auto d-flex" style={{ width: "40%" }}>
                            <Row>
                                <Col>
                                    F2C2
                                    <DealerCards socket={socket}></DealerCards>
                                </Col>
                            </Row>
                        </Container>
                        <Row>
                           <div className="" style={{paddingTop:"20px"}}>
                           <div className="boton1 d-inline-block">
                                <button onClick={hit} disabled={!buttonsEnabled}>
                                    Pedir
                                </button>
                            </div>
                            <div className="boton2 d-inline-block">
                                <button onClick={stay} disabled={!buttonsEnabled}>
                                    Plantarse
                                </button>
                            </div>
                           </div>
                        </Row>
                    </Col>
                    <Col md={4}>
                        <Container className="mx-auto d-flex" style={{ width: "40%" }}>
                            <Row>
                                <Col>
                                    F2C3
                                    <PlayerCards socket={socket} idPlayer={playersId[1]} showCards={gameFinished}></PlayerCards>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-1 mb-4">
                    <Col md={4}>
                        <Container className="mx-auto d-flex" style={{ width: "40%" }}>
                            <Row>
                                <Col>
                                    F3C1
                                    <PlayerCards socket={socket} idPlayer={playersId[0]} showCards={true}></PlayerCards>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;
