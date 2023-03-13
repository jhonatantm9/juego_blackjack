import { useState, useEffect } from "react";
import { Card, CardGroup } from 'react-bootstrap';
import React, { Component } from 'react';


/*class NickList extends Component {
    state = {
      nicks: [
        { name: "Nick 1", description: "Descripción de Nick 1" },
        { name: "Nick 2", description: "Descripción de Nick 2" },
        { name: "Nick 3", description: "Descripción de Nick 3" }
      ]
    };
  
    render() {
      const { nicks } = this.state;
      return (
        <CardGroup>
          {nicks.map((nick, index) => (
            <Card key={index}>
              <Card.Body>
                <Card.Title>{nick.name}</Card.Title>
                <Card.Text>{nick.description}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </CardGroup>
      );
    }
  }*/
/*const nicks = ['nick1', 'nick2', 'nick3'];
const cardTemplate = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title"></h5>
      </div>
    </div>
  `;
  const cardGroup = document.querySelector('.card-group');
  nicks.forEach((nick) => {
      const card = document.createElement('div');
      card.innerHTML = cardTemplate.trim();
      const cardTitle = card.querySelector('.card-title');
      cardTitle.textContent = nick;
      cardGroup.appendChild(card.firstChild);
  });*/


export default function PlayerCards({ socket, idPlayer, showCards }) {
    const [cards, setCards] = useState([]);
    //const [cardsValues, setCardsValues] = useState([]);
    const [cardsValues, setCardsValues] = useState(new Set());
    const [idP, setIdP] = useState("None");
    //let playerId = "";
    //console.log(idP);

    socket.on("receive_card", (data) => {
        console.log("Receive card " + idPlayer);
        //console.log("idPlayer: " + idPlayer + "\nidP: " + idP);
        if (idPlayer === data.id) {
            console.log("Card for " + idPlayer + "  " + data.card);            
            // setCardsValues( ( ) => { cardsValues.push(data.card); return cardsValues; } );
            //setCardsValues((prevCardsValues) => [...prevCardsValues, data.card]);
            setCardsValues((prevCardsValues) => new Set([...prevCardsValues, data.card]));
            console.log("Card added to cardsValues " + cardsValues);
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
            if(idPlayer === element[0] && cards.length < 2){
                console.log("Card for "+ idPlayer + "  " + element[1]);
                //setCardsValues((prevCardsValues) => [...prevCardsValues, element[1]]);
                setCardsValues((prevCardsValues) => new Set([...prevCardsValues, element[1]]));
                if(showCards){
                    //console.log("showCard " + element[1]);
                    setCards((prevCards) => [...prevCards, element[1]]);
                }else{
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
      if(cardsValues.size != cards.length){
        //cards.pop()
        const newArray = cards.slice(0, -1);
        setCards(newArray);
      }
      console.log("cards length: " + cards.length);
    }, [cardsValues]);

    return (
        <div id='deck'>
            <h4>Id: {idPlayer}</h4>
            <CardGroup>
                {
                    cards.map((card, index) => {
                        let imageString = "images/" + card + ".png";
                        let keyValue = card + "-" + index;
                        return (
                            <Card key={keyValue}>
                                <Card.Img variant="top" src={imageString} style={{ width: '100px' }} />
                            </Card>
                        );
                    })
                }
            </CardGroup>
        </div>
    );
}