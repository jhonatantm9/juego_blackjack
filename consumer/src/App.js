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
                <Row>
                    <Col>
                        C1
                    </Col>
                    <Col xs={8}>
                        <PlayerCards socket={socket}></PlayerCards>
                    </Col>
                    <Col>
                        C3
                    </Col>
                </Row>
            </Container>
            <Card key={'hi'}>Hi</Card>
            <Image src="images/2-C.png"></Image>
        </div>
    );
}

export default App;
