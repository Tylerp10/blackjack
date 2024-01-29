import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function Game(){

    // USER INFO -------------------------------//

    const [name, setName] = useState()
    const [balance, setBalance] = useState()
        
    useEffect(() => {
        fetch("http://localhost:5000/userInfo", {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            token: window.localStorage.getItem("token"),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data, "userInfo");
            
            setName(data.data.name)
            setBalance(data.data.balance)
            
        });
      }, []);


    const [betPlaced, setBetPlaced] = useState(false)
    const [betSize, setBetSize] = useState(0)
    const [moneyUpdate, setMoneyUpdate] = useState(false)


    const [playerCards, setPlayerCards] = useState([])
    const [compCards, setCompCards] = useState([])
    const [playerBust, setPlayerBust] = useState(false)
    const [compBust, setCompBust] = useState(false)
    const [disableHit, setDisableHit] = useState(true)
    const [disableStand, setDisableStand] = useState(true)
    const [disableDeal, setDisableDeal] = useState(true)
    const [showTotal, setShowTotal] = useState(false)
    const [gameOver, setGameOver] = useState(false)

    const cards = [2,3,4,5,6,7,8,9,10,"J","Q","K","A"]

    // RANDOM CARD GENERATED -------------------------------//

    function randomCard() {
        let i = Math.floor(Math.random() * cards.length)
        return cards[i]
    }
    
    function hit() {
        if (calculateTotal(playerCards) < 21){
            setPlayerCards([...playerCards, randomCard()])
        } else {
            setDisableHit(true)
        }
    }   

    // PLAYER TURN DONE -------------------------------//

    function stand() {
        setDisableHit(true)
        setDisableStand(true)
        computerTurn()
        setGameOver(true)
        setMoneyUpdate(true)
        setBetPlaced(false)
    }

    function computerTurn(){
        let compHand = [...compCards]

        while (calculateTotal(compHand) < 17 ) {
            compHand.push(randomCard())
        }
        setCompCards(compHand)

        if (calculateTotal(compHand) > 21){
            setCompBust(true)
        }
    }

    // CALCULATE HAND TOTALS -------------------------------//
    
    function calculateTotal(hand) {
        let total = hand.reduce((total,card) => {
            if(card === "J" || card === "Q" || card === "K"){
                return total + 10;
            } else if (card === "A"){
                return total + 11
            } else {
                return total + card
            }
        }, 0);

        hand.filter(card => card === "A").forEach(() => {
            if (total > 21) {
                total -= 10;
            }
        })
        
        return total
    }
    
    // DETERMINE IF PLAYER BUSTED -------------------------------//
      
    function bust(){
        if(calculateTotal(playerCards) > 21){
            setPlayerBust(true)
            setDisableHit(true)
            setDisableStand(true)
            setGameOver(true)
            setMoneyUpdate(true)
            setBetPlaced(false)
        }
    }

    // DETERMINE WHO WON -------------------------------//

    function determineWinner() {

        if (!compBust && !playerBust){
            const compDifference = (21 - calculateTotal(compCards))
            const playerDifference = (21 - calculateTotal(playerCards))
        
            if (compDifference < playerDifference){
                return "You Lose"
            } else if (compDifference > playerDifference){
                return "Winner!"
            } else if (calculateTotal(compCards) === calculateTotal(playerCards)) {
                return "Push"
            }

        } else if (compBust) {
            return "Winner!"
        } else if (playerBust) {
            return "You Lose"
        }
    }



    // BETTING -------------------------------//

    function betting() {

    if (isNaN(betSize) || betSize <= 0){
        alert("Enter a valid bet")
        return
    }

    if (betSize > balance) {
        alert("Insuffiicient Funds")
        return
    }
        setGameOver(false)
        setBetPlaced(true)
        setPlayerCards([])
        setCompCards([])
        setCompBust(false)
        setPlayerBust(false)
        setDisableDeal(false)
        setShowTotal(false)
    }

    // BEGIN ROUND -------------------------------//

    function dealCards(){
        setPlayerCards([randomCard(), randomCard()])
        setCompCards([randomCard()])
        setPlayerBust(false)
        setDisableHit(false)
        setDisableStand(false)
        setCompBust(false)
        setGameOver(false)
        setMoneyUpdate(false)
        setDisableDeal(true)
        setShowTotal(true)
    }
        

// UPDATE BALANCE -------------------------------//

function useUpdatedBalanceEffect(moneyUpdate, balance, betSize) {
    useEffect(() => {
      const updateBalanceInMongoDB = async () => {
        if (moneyUpdate) {
          try {
            let updatedBalance;
  
            if (determineWinner() === "Winner!") {
              updatedBalance = balance + parseFloat(betSize);
            } else if (determineWinner() === "You Lose") {
              updatedBalance = balance - parseFloat(betSize);
            } else {
                return balance
            }
  
            setBalance(updatedBalance);
  
            const response = await fetch("http://localhost:5000/userInfo", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                balance: updatedBalance, 
              }),
            });
  
            // Handle the response if needed
            const updatedUserData = await response.json();
            console.log('User balance updated:', updatedUserData);
          } catch (error) {
            console.error('Error updating user balance:', error);
          }
        }
        
      };
  
      updateBalanceInMongoDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moneyUpdate]); 
    return [];
  }
  
    useUpdatedBalanceEffect(moneyUpdate, balance, betSize)

  
    useEffect(() => {
        bust(playerCards)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerCards])


    return (
        <div className="board">
        <div className="game">
            <div className="dealer">
                <div className="dealer-cards">
                    {compCards.map((card, index)=>(
                        <div className="cards" key={index}>{card}</div>
                    ))}
                </div>
                {showTotal && <div className="total">{calculateTotal(compCards)}</div>}
                {compBust && <div className="bust">Dealer BUST</div>}
            </div>

            <div className="player">
                <div className="player-cards">
                    {playerCards.map((card, index)=>(
                        <div className="cards" key={index}>{card}</div>
                    ))}
                </div>
                {showTotal && <div className="total">{calculateTotal(playerCards)}</div>}
                {playerBust && <div className="bust">BUST</div>}
            </div>
            {gameOver && <div className="result">{determineWinner()}</div>}
            <div className="buttons">
                <div className="playbtns">
                    <button onClick={dealCards} disabled={disableDeal}>Deal</button>
                    <button onClick={hit} disabled={disableHit}>Hit</button>
                    <button onClick={stand} disabled={disableStand}>Stand</button>
                </div>
                <div className="bettingbtns">
                    <input
                        type="number"
                        value={betSize || ""}
                        onChange={(e) => {
                            const inputBetSize = parseFloat(e.target.value)
                            if(!isNaN(inputBetSize)){
                                setBetSize((inputBetSize))
                            } else {
                                setBetSize("")
                            }
                        }}
                    />
                    <button onClick={betting} disabled={betPlaced}>Place Bet</button>
                </div>
            </div>
            </div>


            <div className="footer">
                {name}: ${balance}
                <button className="logout"><Link className="logout-btn" to="/signin">Log Out</Link></button>
            </div>

    
        </div>
    )
}