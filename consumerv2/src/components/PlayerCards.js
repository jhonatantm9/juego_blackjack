import { CardGroup, Card, CardImg } from "react-bootstrap";
import { useState } from "react";

export default function PlayerCards({ socket, idPlayer, showCards }) {
    const [cardsValues, setCardsValues] = useState(new Set());

    socket.on("receive_card", (data) => {
        //console.log("Receive card " + idPlayer);
        //console.log("idPlayer: " + idPlayer + "\nidP: " + idP);
        if (idPlayer === data.id) {
            console.log("Card for " + idPlayer + "  " + data.card);
            setCardsValues((prevCardsValues) => new Set([...prevCardsValues, data.card]));
        }
    });

    socket.on("receive_initial_cards", (data) => {
        //console.log(data.cards);
        //console.log(idP);
        data.cards.forEach(element => {
            if (idPlayer === element[0]) {
                console.log("Card for " + idPlayer + "  " + element[1]);
                setCardsValues((prevCardsValues) => new Set([...prevCardsValues, element[1]]));
            }
        });
    });

    // socket.on("receive_message", (data) => {
    //     console.log("Llegó un mensaje");
    //     setCards(() => { cards.push(data.message); return cards; });
    //     console.log(cards);
    // });

    return (
        <CardGroup style={{
            maxWidth: "180px",
            backgroundColor: "#c8c2c2",
        }}>
            {
                [...cardsValues].map((card, index) => {
                    if (showCards) {
                        return (
                            <Card key={`${card}-${index}`}>
                                <CardImg src={`assets/images/${card}.png`} style={{ width: "100px" }} />
                            </Card>
                        );
                    } else {
                        let imageString = "images/BACK.png";
                        let keyValue = card + "-" + index;
                        return (
                            <Card key={`${card}-${index}`}>
                                <CardImg src={`assets/images/BACK.png`} style={{ width: "100px" }} />
                            </Card>
                        );
                    }
                })
            }
        </CardGroup>
    );
};

