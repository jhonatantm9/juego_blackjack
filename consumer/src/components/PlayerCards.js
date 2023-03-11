import { useState, useEffect } from "react";
import { Card, CardGroup } from 'react-bootstrap';

export default function PlayerCards( { socket, idPlayer, showCards } ){
    const [cards, setCards] = useState([]);
    const [cardsValues, setCardsValues] = useState([]);
    const [idP, setIdP] = useState(idPlayer);
    //let playerId = "";
    //console.log(idP);

    useEffect(() => {
        
        console.log("Se ejecuto use Effect: " + idP);
        socket.on("receive_message", (data) => {
            console.log("Llegó un mensaje");
            setCards( ( ) => { cards.push(data.message); return cards; } );
            console.log(cards);
        });

        socket.on("receive_card", (data) => {
            console.log("Receive card " + idPlayer);
            
            if(idPlayer === data.id){
                // console.log("Card for "+ idPlayer + "  " + data.card);
                setCardsValues( ( ) => { cardsValues.push(data.card); return cardsValues; } );
                if(showCards){
                    console.log()
                    setCards( ( ) => { cards.push("BACK"); return cards; } );
                }else{
                    setCards( ( ) => { cards.push(data.card); return cards; } );
                }
            }
        });
    }, [socket, idP]);

    useEffect(() => {
        
        setIdP(idPlayer);
        //console.log("cambio de id por: " + idP);
    }, [idPlayer]);

    return(
        <div id='deck'>
            <CardGroup>
                {
                    cards.map(card => {
                        let imageString = "images/" + card + ".png";
                        return(
                            <Card key={card}>
                                <Card.Img variant="top" src={imageString} style={{width:'100px'}}/>
                            </Card>
                        );
                    })
                }
            </CardGroup>
        </div>
    );
}