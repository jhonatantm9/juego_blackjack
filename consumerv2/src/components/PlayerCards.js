import { CardGroup, Card, CardImg } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function PlayerCards({ socket, idPlayer, showCards }) {
    const [cards, setCards] = useState([]);
    //const [cardsValues, setCardsValues] = useState([]);
    const [cardsValues, setCardsValues] = useState(new Set());
    const [idP, setIdP] = useState("None");
    //let playerId = "";
    //console.log(idP);

    socket.on("receive_card", (data) => {
        //console.log("Receive card " + idPlayer);
        //console.log("idPlayer: " + idPlayer + "\nidP: " + idP);
        if (idPlayer === data.id) {
            console.log("Card for " + idPlayer + "  " + data.card);
            // setCardsValues( ( ) => { cardsValues.push(data.card); return cardsValues; } );
            //setCardsValues((prevCardsValues) => [...prevCardsValues, data.card]);
            setCardsValues((prevCardsValues) => new Set([...prevCardsValues, data.card]));
            //console.log("Card added to cardsValues " + cardsValues);
            if (showCards) {
                console.log("showCard " + data.card);
                //setCards( ( ) => { cards.push(data.card); return cards; } );
                setCards((prevCards) => [...prevCards, data.card]);
            } else {
                console.log("privateCard " + data.card);
                //setCards( ( ) => { cards.push("BACK"); return cards; } );
                setCards((prevCards) => [...prevCards, "BACK"]);
            }
        }
    });

    socket.on("receive_initial_cards", (data) => {
        //console.log(data.cards);
        //console.log(idP);
        data.cards.forEach(element => {
            if (idPlayer === element[0] && cards.length < 2) {
                console.log("Card for " + idPlayer + "  " + element[1]);
                //setCardsValues((prevCardsValues) => [...prevCardsValues, element[1]]);
                setCardsValues((prevCardsValues) => new Set([...prevCardsValues, element[1]]));
                if (showCards) {
                    //console.log("showCard " + element[1]);
                    setCards((prevCards) => [...prevCards, element[1]]);
                } else {
                    //console.log("privateCard " + element[1]);
                    setCards((prevCards) => [...prevCards, "BACK"]);
                }
            }
        });
        console.log("cartas de " + idPlayer + ": " + cards.toString());
    });

    socket.on("receive_message", (data) => {
        console.log("Llegó un mensaje");
        setCards(() => { cards.push(data.message); return cards; });
        console.log(cards);
    });

    // useEffect(() => {
    //     //console.log("Use effect PlayerCards dependency idPlayer");
    //     setIdP(idPlayer);
    //     console.log("Cambio de la ip " + idP)
    //     //console.log("idP: " + idP);
    // }, [idPlayer]);

    // useEffect(() => {

    //console.log("Se ejecuto use Effect 1: " + idP);


    // socket.on("receive_card", (data) => {
    //     console.log("Receive card " + idP);
    //     //console.log("idPlayer: " + idPlayer + "\nidP: " + idP);
    //     if(idP === data.id){
    //         console.log("Card for "+ idP + "  " + data.card);
    //         // setCardsValues( ( ) => { cardsValues.push(data.card); return cardsValues; } );
    //         setCardsValues((prevCardsValues) => [...prevCardsValues, data.card]);
    //         if(showCards){
    //             console.log("showCard " + data.card);
    //             //setCards( ( ) => { cards.push("BACK"); return cards; } );
    //             setCards((prevCards) => [...prevCards, "BACK"]);
    //         }else{
    //             console.log("privateCard " + data.card);
    //             //setCards( ( ) => { cards.push(data.card); return cards; } );
    //             setCards((prevCards) => [...prevCards, data.card]);
    //         }
    //     }
    // });
    // }, [socket]);
    //idP

    useEffect(() => {
        if (cardsValues.size != cards.length) {
            //cards.pop()
            const newArray = cards.slice(0, -1);
            setCards(newArray);
        }
        console.log("cards length: " + cards.length);
    }, [cardsValues]);

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

                // cards.map((card, index) => (

                //     <Card key={`${card}-${index}`}>
                //         <CardImg src={`assets/images/${card}.png`} style={{ width: "100px" }} />
                //     </Card>
                // ))}
            }
        </CardGroup>
    );
};

