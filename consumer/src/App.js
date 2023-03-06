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
            />
            <Button onClick={sendMessage}>Send Message</Button>
            <h1>Message:</h1>
            {messageReceived}      
            <Container>
                <Row className="justify-content-md-center">
                    <Col>
                        F1C1
                    </Col>
                    <Col xs={8}>
                        <PlayerCards socket={socket}></PlayerCards>
                    </Col>
                    <Col>
                        F1C3
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col md={1}>
                        F2C1
                        <PlayerCards socket={socket}></PlayerCards>
                    </Col>
                    <Col xs={12} md={6} className="justify-content-md-center">
                        F2C2
                        <PlayerCards socket={socket}></PlayerCards>
                    </Col>
                    <Col md={1}>
                        F2C3
                        <PlayerCards socket={socket}></PlayerCards>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col>
                        F3C1
                    </Col>
                    <Col xs={8}>
                        <PlayerCards socket={socket}></PlayerCards>
                    </Col>
                    <Col>
                        F3C3
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;
