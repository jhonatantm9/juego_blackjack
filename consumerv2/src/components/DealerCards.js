import { CardGroup, Card, CardImg } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function DealerCards( { socket } ){
    const [cards, setCards] = useState([]);
    const [cardsValues, setCardsValues] = useState([]);

    // socket.on("receive_dealer_cards", (data) => {
    //     data.cards.forEach(card => {
    //         setCardsValues((prevCardsValues) => [...prevCardsValues, card]);
    //         setCards((prevCards) => [...prevCards, "BACK"]);
    //     });
    // });

    // socket.on("receive_initial_dealer_cards", (data) => {
    //     console.log("# dealer initial cards: " + data.cards + Math.random());
    //     data.cards.forEach((card, index) => {
    //         if(cardsValues.length < 2){
    //             setCardsValues((prevCardsValues) => [...prevCardsValues, card]);
    //             if(index == 0){
    //                 setCards((prevCards) => [...prevCards, card]);
    //             }else{
    //                 setCards((prevCards) => [...prevCards, "BACK"]);
    //             }
    //         }
    //     });        
    //     console.log(cardsValues.toString());
    // });

    socket.on("receive_message", (data) => {
        console.log("Llegó un mensaje");
        setCards( ( ) => { cards.push(data.message); return cards; } );
        console.log(cards);
    });

    useEffect(() => {
        socket.on("receive_initial_dealer_cards", (data) => {
            console.log("# dealer initial cards: " + data.cards + Math.random());
            data.cards.forEach((card, index) => {
                if(cardsValues.length < 2){
                    setCardsValues((prevCardsValues) => [...prevCardsValues, card]);
                    if(index == 0){
                        setCards((prevCards) => [...prevCards, card]);
                    }else{
                        setCards((prevCards) => [...prevCards, "BACK"]);
                    }
                }
            });        
            console.log(cardsValues.toString());
        });

        socket.on("receive_dealer_cards", (data) => {
            data.cards.forEach(card => {
                setCardsValues((prevCardsValues) => [...prevCardsValues, card]);
                setCards((prevCards) => [...prevCards, "BACK"]);
            });
        });
    }, []);
    useEffect(() => {
        console.log(cards.length);
    }, [cards]);

    return(
        <CardGroup style={{
            maxWidth: "180px",
            backgroundColor: "#c8c2c2",
        }}>
            { cards.map( (card, index) => (
                <Card key={`${card}-${index}`}>
                    <CardImg src={`assets/images/${card}.png`} style={{ width: "100px" }}/>
                </Card>
            )) }
        </CardGroup>
    );
};