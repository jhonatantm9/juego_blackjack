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
            <Image src={require=("../static/media/10-C.png")}/>
            <CardGroup>
                {
                    cards.map(card => {
                        let imageString = "../static/media/" + card + ".png";
                        return(
                            <div>
                            <Card key={card}>
                                {/* <Card.Img variant="top" src={require(imageString)} /> */}
                                <Card.Body>{card}</Card.Body>
                            </Card>
                            <Card>
                            <Image src={require=("../static/media/10-C.png")}/>
                            {card}
                        </Card>
                        </div>
                        );
                    })
                }
            </CardGroup>
        </div>
    );
}