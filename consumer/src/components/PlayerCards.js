import { useState, useEffect } from "react";
import { Card, CardGroup } from 'react-bootstrap';

export default function PlayerCards(props){
    const [cards, setCards] = useState([]);
    const [cardsValues, setCardsValues] = useState([]);
    let playerId = props.socket.id;

    useEffect(() => {
        props.socket.on("receive_message", (data) => {
            console.log("Llegó un mensaje");
            setCards( ( ) => { cards.push(data.message); return cards; } );
            console.log(cards);
        });

        // props.socket.on("initial_card", (data) => {
        //     setCards( ( ) => { cards.push(data.card); return cards; } );
        // });

        // props.socket.on("receive_card", (data) => {
        //     addCard(data.card);
        // });

        props.socket.on("add_card", (data) => {
            if(playerId === data.playerId){
                setCardsValues( ( ) => { cardsValues.push(data.card); return cardsValues; } );
                if(data.private){
                    setCards( ( ) => { cards.push("BACK"); return cards; } );
                }else{
                    setCards( ( ) => { cards.push(data.card); return cards; } );
                }
            }
        });
    }, [props.socket])

    // const addCard  = (card) => {
    //     setCards( ( ) => { cards.push(card); return cards; } );
    // }

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