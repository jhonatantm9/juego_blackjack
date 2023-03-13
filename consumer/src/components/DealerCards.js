import { useState, useEffect } from "react";
import { Card, CardGroup } from 'react-bootstrap';

export default function PlayerCards( { socket } ){
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
        <div id='deck'>
            <CardGroup>
                {
                    cards.map( (card, index) => {
                        let imageString = "images/" + card + ".png";
                        let keyValue = card + "-" + index;
                        return(
                            <Card key={keyValue}>
                                <Card.Img variant="top" src={imageString} style={{width:'100px'}}/>
                            </Card>
                        );
                    })
                }
            </CardGroup>
        </div>
    );
}