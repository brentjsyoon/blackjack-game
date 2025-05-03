let player = {
    name: "Brent",
    chips: 1000
}
let deck = [];
let cards = [];
let dealerCards = [];
let suits = ["diamonds", "hearts", "clubs", "spades"];
let numAces = 0;
let sumCards = 0;
let dealerSum = 0;
let hasBlackJack = false;
let gameDone = true;
let bet = 0;
let secondRoundBetAllowance = 0;
let betsAllowed = true;
let firstBet = true;
let message = "";
let messageEl = document.getElementById("message-el");
let sumEl = document.querySelector("#sum-el");
let cardsEl = document.getElementById("cards-el");
let dealerEl = document.getElementById("dealer-el");
let dealerSumEl = document.getElementById("dealersum-el");
let playerEl = document.getElementById("player-el");
let betEl = document.getElementById("bet-el");

playerEl.textContent = player.name + ": $" + player.chips;

function startGame() {
    if (bet > 0 && gameDone === true) {
        gameDone = false;
        sumCards = 0;
        numAces = 0;
        hasBlackJack = false;
        firstBet = false;
        deck = [...Array(52).keys()];
        shuffle(deck);
        dealerCards = [];
        dealerSum = 0;
        dealerEl.textContent = "Dealer:";
        dealerSumEl.textContent = "Dealer's Sum:";
        let firstCard = deck.pop();
        let secondCard = deck.pop();
        cards = [firstCard, secondCard];
        sumCards = updateSumCards(cards);
        renderGame();
        document.getElementById("start-el").innerText = "NEW ROUND";
    }
}

function renderGame() {
    cardsEl.textContent = "Cards: ";
    sumEl.textContent = "Sum: " + sumCards;

    renderCardImg(cardsEl, cards);

    if (sumCards <= 20) {
        message = "Do you want to draw a new card?";
    }
    else if (sumCards === 21) {
        message = "You've got Blackjack";
        hasBlackJack = true;
    }
    else {
        message = "You're out of the game!";
        gameDone = true;
        decideWinner();
    }

    messageEl.textContent = message;
}

function renderCardImg(element, hand) {
    for (let i=0; i<hand.length; i++) {
        const img = document.createElement("img");
        let rank = hand[i] % 13 + 1;
        let suit = Math.floor(hand[i] / 13);
        let imgName = rank + "_of_" +  suits[suit] + ".png";
        img.src = './images/carddeck/' + imgName;
        img.style.marginRight = '10px';
        img.style.marginLeft = '10px';
        img.alt = rank + " of " + suits[suit];
        img.width = 90;

        element.appendChild(img);
    }
}

function updateSumCards(addCards) {
    let score = 0;
    for (let i=0; i<addCards.length; i++) {
        let rank = addCards[i] % 13 + 1;
        if (rank > 10) {
            score += 10;
        }
        else if (rank === 1) {
            numAces++;
            score += 11;
        }
        else {
            score += rank;
        }
    }

    while (score > 21 && numAces > 0) {
        score -= 10;
        numAces -= 1;
    }

    numAces = 0;

    return score;
}

function shuffle(array) {
    for (let i = array.length-1; i>0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

function newCard() {
    if (!gameDone && !hasBlackJack) {
        let card = deck.pop();
        cards.push(card);
        sumCards = updateSumCards(cards);
        betsAllowed = false;
        renderGame();
    }
}

function stay() {
    if (!gameDone) {
        while (dealerSum < 17) {
            dealerCards.push(deck.pop());
            dealerSum = updateSumCards(dealerCards);
        }

        dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;

        renderCardImg(dealerEl, dealerCards);

        decideWinner();

        gameDone = true;
    }
}

function decideWinner() {
    if (sumCards > 21) {
        player.chips -= bet;
    }
    else if (dealerSum > 21) {
        player.chips += bet;
    }
    else if (sumCards > dealerSum) {
        player.chips += bet;
    }
    else if (sumCards == dealerSum) {
    }
    else {
        player.chips -= bet;
    }

    bet = 0;
    firstBet = true;
    betsAllowed = true;
    secondRoundBetAllowance = 0;
    playerEl.textContent = player.name + ": $" + player.chips;
    betEl.textContent = "Your Bet:";
}

function placeBet() {
    if (betsAllowed) {
        let amount = document.getElementById("amountInput").value;
        let betAmount = parseInt(amount);

        if (betAmount+bet > player.chips) {
            betEl.textContent = "Your Bet: $" + bet + " (Insufficient Chips!)";
            return;
        }
        if (betAmount < 1 || isNaN(betAmount)) {
            betEl.textContent = "Your Bet: Must bet at least $1";
            return;
        }

        if (firstBet) {
            bet += betAmount;
            secondRoundBetAllowance += betAmount;
            betEl.textContent = "Your Bet: $" + bet;
        }
        else if (betAmount <= bet) {
            if (secondRoundBetAllowance - betAmount < 0) {
                betEl.textContent = "Your Bet: $" + bet + " (Cannot Exceed First Round Bet!)";
            }
            else {
                bet += betAmount;
                secondRoundBetAllowance -= betAmount;
                betEl.textContent = "Your Bet: $" + bet;
            }
        }
    }
}