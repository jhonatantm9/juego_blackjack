import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from "react";
import PlayerCards from './components/PlayerCards.js';
import { Card, Button, Container, Row, Col, Image } from 'react-bootstrap';

const socket = io.connect("http://localhost:3001");//URL backend

function App() {
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("");
    var playersId = ["", "", "", ""];

    const sendMessage = () => {
        socket.emit("send_message", { message });
    };

    const startGame = () => {
        socket.emit("start_game", {hostPlayer: socket.id});
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageReceived(data.message);
        });

        socket.on("receive_ids", (data) => {
            let i = 0;
            while(i < data.playersId.length){
                playersId[i] = data.playersId[i];
                i++;
            }
            for(let j = 0; j < 4; j++){
                let aux = playersId[j];
                if(aux === socket.id){
                    playersId[j] = playersId[0];
                    playersId[0] = aux;
                }
            }
            console.log(playersId);
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
            <Container>
                <Row className="justify-content-md-center mt-1 mb-4">
                    <Col sm={4}>
                        <Container className="mx-auto d-flex" style={{ width: "40%" }}>
                            <Row>
                                <Col>
                                    F1C1
                                    <PlayerCards socket={socket} id={playersId[3]} private={true}></PlayerCards>
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
                                    <PlayerCards socket={socket} id={playersId[2]} private={true}></PlayerCards>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col md={4}>
                        <Container className="mx-auto d-flex" style={{ width: "40%" }}>
                            <Row>
                                <Col>
                                    F2C2
                                    <PlayerCards socket={socket}></PlayerCards>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col md={4}>
                        <Container className="mx-auto d-flex" style={{ width: "40%" }}>
                            <Row>
                                <Col>
                                    F2C3
                                    <PlayerCards socket={socket} id={playersId[1]} private={true}></PlayerCards>
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
                                    <PlayerCards socket={socket} id={playersId[0]} private={false}></PlayerCards>
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
