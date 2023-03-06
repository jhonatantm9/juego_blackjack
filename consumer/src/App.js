import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from "react";
import PlayerCards from './components/PlayerCards.js';
import { Card, Button, Container, Row, Col, Image } from 'react-bootstrap';

const socket = io.connect("http://localhost:3001");//URL backend

function App() {
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState("");


    const sendMessage = () => {
        socket.emit("send_message", { message });
    };

    const startGame = () => {
        socket.emit("start_game");
    };

    useEffect(() => {
        socket.on("recieve_message", (data) => {
            setMessageReceived(data.message);
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
                                    <PlayerCards socket={socket}></PlayerCards>
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
                                    <PlayerCards socket={socket}></PlayerCards>
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
                                    <PlayerCards socket={socket}></PlayerCards>
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
                                    <PlayerCards socket={socket}></PlayerCards>
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
