import { CardGroup, Card, CardImg } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function PlayerCards({ socket, idPlayer, showCards }) {
    const [cards, setCards] = useState([]);
    const [cardsValues, setCardsValues] = useState([]);

    socket.on("receive_card", (data) => {
        console.log("Receive card " + idPlayer);
        //console.log("idPlayer: " + idPlayer + "\nidP: " + idP);
        if (idPlayer === data.id) {
            console.log("Card for " + idPlayer + "  " + data.card);
            // setCardsValues( ( ) => { cardsValues.push(data.card); return cardsValues; } );
            setCardsValues((prevCardsValues) => [...prevCardsValues, data.card]);
            if (showCards) {
                console.log("showCard " + data.card);
                //setCards( ( ) => { cards.push("BACK"); return cards; } );
                setCards((prevCards) => [...prevCards, "BACK"]);
            } else {
                console.log("privateCard " + data.card);
                //setCards( ( ) => { cards.push(data.card); return cards; } );
                setCards((prevCards) => [...prevCards, data.card]);
            }
        }
    });

    socket.on("receive_initial_cards", (data) => {
        data.cards.forEach(element => {
            if (idPlayer === element[0] && cards.length < 2) {
                console.log("Card for " + idPlayer + "  " + element[1]);
                setCardsValues((prevCardsValues) => [...prevCardsValues, element[1]]);
                if (showCards) {
                    //console.log("showCard " + element[1]);
                    setCards((prevCards) => [...prevCards, "BACK"]);
                } else {
                    //console.log("privateCard " + element[1]);
                    setCards((prevCards) => [...prevCards, element[1]]);
                }
            }
        });
        console.log("cartas de " + idPlayer + ": " + cards.toString());
    });

    useEffect(() => {

        //console.log("Se ejecuto use Effect 1: " + idP);
        socket.on("receive_message", (data) => {
            console.log("Llegó un mensaje");
            setCards(() => { cards.push(data.message); return cards; });
            console.log(cards);
        });
    }, [socket]);

    return (
        <CardGroup style={{
            maxWidth: "180px",
            backgroundColor: "#c8c2c2",
        }}>
            {cards.map((card, index) => (
                <Card key={`${card}-${index}`}>
                    <CardImg src={`assets/images/${card}.png`} style={{ width: "100px" }} />
                </Card>
            ))}
        </CardGroup>
    );
};

