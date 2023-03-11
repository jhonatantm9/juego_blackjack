import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from "react";
import PlayerCards from './components/PlayerCards.js';
import { Card, Button, Container, Row, Col, Image } from 'react-bootstrap';

const socket = io.connect("http://localhost:3001");//URL backend

function App() {
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("");
    const [playersId, setPlayersId] = useState(["", "", "", ""]);

    const sendMessage = () => {
        socket.emit("send_message", { message });
    };

    const startGame = () => {
        socket.emit("start_game", { hostPlayer: socket.id });
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
        console.log("new array: " + newArray);
        //setPlayersId(newArray);
        return(newArray);
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


    socket.on("receive_message", (data) => {
        setMessageReceived(data.message);
    });

    useEffect(() => {
        console.log("UseEffect App.js");
        // socket.on("receive_message", (data) => {
        //     setMessageReceived(data.message);
        // });

        socket.on("receive_ids", (data) => {
            console.log("data: " + data.playersId);
            // setPlayersId([...changeArray(data)]);
            //changeArray(data);
            changeIdPlayers(data);
            // setPlayersId([...newArray]);
            // setPlayersId(() => {
            //     let i = 0;
            //     while (i < data.playersId.length) {
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
            console.log("Array playersId luego de function: " + playersId);
        });
    }, [socket])


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
                                    {/* <PlayerCards socket={socket} idPlayer={playersId[3]} showCards={true} /> */}
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
                                    {/* <PlayerCards socket={socket} idPlayer={playersId[2]} showCards={true}></PlayerCards> */}
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col md={4}>
                        <Container className="mx-auto d-flex" style={{ width: "40%" }}>
                            <Row>
                                <Col>
                                    F2C2
                                    {/* <PlayerCards socket={socket}></PlayerCards> */}
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col md={4}>
                        <Container className="mx-auto d-flex" style={{ width: "40%" }}>
                            <Row>
                                <Col>
                                    F2C3
                                    <PlayerCards socket={socket} idPlayer={playersId[1]} showCards={true}></PlayerCards>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mb-4">
                    <Col md={4}>
                        <Container className="mx-auto d-flex" style={{ width: "40%" }}>
                            <Row>
                                <Col>
                                    F3C1
                                    <PlayerCards socket={socket} idPlayer={playersId[0]} showCards={false}></PlayerCards>
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
