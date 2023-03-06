import { useState, useEffect } from "react";
import { Card, CardGroup } from 'react-bootstrap';

export default function PlayerCards(props){
    const [cards, setCards] = useState([]);
    let playerId = props.socket.id;

    useEffect(() => {
        props.socket.on("recieve_message", (data) => {
            console.log("Llegó un mensaje");
            setCards( ( ) => { cards.push(data.message); return cards; } );
            console.log(cards);
        });

        props.socket.on("receive_card", (data) => {
            setCards( ( ) => { cards.push(data.card); return cards; } );
        });

        props.socket.on("add_card", (data) => {
            if(playerId === data.playerId){
                setCards( ( ) => { cards.push("BACK"); return cards; } );
            }
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
                            </Card>
                        );
                    })
                }
            </CardGroup>
        </div>
    );
}