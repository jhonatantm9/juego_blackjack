import { useState, useEffect } from "react";
import { Card, CardGroup } from 'react-bootstrap';

export default function PlayerCards( { socket, idPlayer, showCards } ){
    const [cards, setCards] = useState([]);
    const [cardsValues, setCardsValues] = useState([]);
    const [idP, setIdP] = useState("None");
    //let playerId = "";
    //console.log(idP);

    socket.on("receive_card", (data) => {
        console.log("Receive card " + idP);
        //console.log("idPlayer: " + idPlayer + "\nidP: " + idP);
        if(idPlayer === data.id){
            console.log("Card for "+ idPlayer + "  " + data.card);
            // setCardsValues( ( ) => { cardsValues.push(data.card); return cardsValues; } );
            setCardsValues((prevCardsValues) => [...prevCardsValues, data.card]);
            if(showCards){
                console.log("showCard " + data.card);
                //setCards( ( ) => { cards.push("BACK"); return cards; } );
                setCards((prevCards) => [...prevCards, "BACK"]);
            }else{
                console.log("privateCard " + data.card);
                //setCards( ( ) => { cards.push(data.card); return cards; } );
                setCards((prevCards) => [...prevCards, data.card]);
            }
        }
    });

    socket.on("receive_initial_cards", (data) => {
        //console.log(data.cards);
        //console.log(idP);
        data.cards.forEach(element => {
            if(idPlayer === element[0] && cards.length < 2){
                console.log("Card for "+ idPlayer + "  " + element[1]);
                setCardsValues((prevCardsValues) => [...prevCardsValues, element[1]]);
                if(showCards){
                    //console.log("showCard " + element[1]);
                    setCards((prevCards) => [...prevCards, "BACK"]);
                }else{
                    //console.log("privateCard " + element[1]);
                    setCards((prevCards) => [...prevCards, element[1]]);
                }
            }
        });
        console.log("cartas de " + idPlayer + ": " + cards.toString());
    });

    // useEffect(() => {
    //     //console.log("Use effect PlayerCards dependency idPlayer");
    //     setIdP(idPlayer);
    //     console.log("Cambio de la ip " + idP)
    //     //console.log("idP: " + idP);
    // }, [idPlayer]);

    useEffect(() => {
        
        //console.log("Se ejecuto use Effect 1: " + idP);
        socket.on("receive_message", (data) => {
            console.log("Llegó un mensaje");
            setCards( ( ) => { cards.push(data.message); return cards; } );
            console.log(cards);
        });

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
    }, [socket]);
    //idP

    

    return(
        <div id='deck'>
            <h4>Id: {idPlayer}</h4>
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