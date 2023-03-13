import { Container, Form, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MainView = () => {
    const [nickName, setNickName] = useState("");
    const [roomId, setRoomId] = useState("");
    const navigate = useNavigate();
    const handleIngresar = (e) => {
        //Podria hacerse
        /* const nickName = event.target.nickName.value;
        const roomId = event.target.roomId.value;
        navigate(`/room/${roomId}/${nickName}`); */
        localStorage.setItem("nickName", nickName);
        localStorage.setItem("roomId", roomId);
        navigate("/game");
    };

    return (
        <Container fluid style={{
            backgroundImage: "url(assets/images/bj.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "500px",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "end",
            paddingRight: "30%",
        }}>
            <Form style={{
                width: "250px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
                borderRadius: "10px",
                padding: "30px 20px",
            }} onSubmit={(e) => { e.preventDefault(); }}>
                <FormGroup controlId="nickName" className="mb-3">
                    <FormLabel>Enter your nickname</FormLabel>
                    <FormControl type="text" placeholder="Enter nickname"
                        value={nickName} onChange={(e) => { setNickName(e.target.value.trim()); }} />
                </FormGroup>
                <FormGroup controlId="roomId" className="mb-3">
                    <FormLabel>Enter the room ID</FormLabel>
                    <FormControl type="text" placeholder="Enter room ID"
                        value={roomId} onChange={(e) => { setRoomId(e.target.value.trim()); }} />
                </FormGroup>
                <Button variant="primary" onClick={handleIngresar}>
                    Ingresar
                </Button>
            </Form>
        </Container>
    );
};

export default MainView;