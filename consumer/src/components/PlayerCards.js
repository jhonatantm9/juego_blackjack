import { useState, useEffect } from "react";
import { Card, CardGroup, Image } from 'react-bootstrap';

export default function PlayerCards(props){
    const [cards, setCards] = useState([]);

    useEffect(() => {
        props.socket.on("recieve_message", (data) => {
            console.log("Llegó un mensaje");
            setCards( ( ) => { cards.push(data.message); return cards; } );
            console.log(cards);
        });
    }, [props.socket])

    return(
        <div id='deck'>
            <CardGroup>
                {
                    cards.map(card => {
                        let imageString = "images/" + card + ".png";
                        return(
                            <Card key={card}>
                                <Card.Img variant="top" src={imageString} style={{width:'100px'}}/>
                                <Card.Body>{card}</Card.Body>
                            </Card>
                        );
                    })
                }
            </CardGroup>
        </div>
    );
}