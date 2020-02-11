/*
In the basic game there are two players and you use a standard 52 card pack.
Cards rank as usual from high to low: A K Q J T 9 8 7 6 5 4 3 2.
Suits are ignored in this game.

Deal out all the cards, so that each player has 26.
Players do not look at their cards, but keep them in a packet face down.
The object of the game is to win all the cards.

Both players now turn their top card face up and put them on the table.
Whoever turned the higher card takes both cards and adds them (face down)
to the bottom of their packet. Then both players turn up their next card and so on.

If the turned up cards are equal there is a war.
The tied cards stay on the table and both players play the next card
of their pile face down and then another card face-up. Whoever has the
higher of the new face-up cards wins the war and adds all six cards
face-down to the bottom of their packet. If the new face-up cards are equal as well,
the war continues: each player puts another card face-down and one face-up.
The war goes on like this as long as the face-up cards continue to be equal.
As soon as they are different the player of the higher card wins all the cards in the war.

The game continues until one player has all the cards and wins. This can take a long time.

If a player runs out of cards during a war. If you don't have enough cards to
complete the war, you lose. If neither player has enough cards, the one who runs
out first loses. If both run out simultaneously, it's a draw.
*/

const shuffle = require('secure-shuffle')

module.exports = function playWar () {
  const deck = getDeck()
  const shuffledDeck = shuffle(deck)
  const { playerOne, playerTwo } = deal(shuffledDeck)

  const turnResults = []

  let cards = []
  while (playerOne.length && playerTwo.length) {
    const playerOneCard = playerOne.shift()
    const playerTwoCard = playerTwo.shift()
    if (!playerOneCard || !playerTwoCard) {
      return {
        winner: playerOneCard ? 0 : 1,
        turnResults
      }
    }

    cards.unshift(playerOneCard, playerTwoCard)

    if (playerOneCard === playerTwoCard) {
      const playerOneSecondCard = playerOne.shift()
      const playerTwoSecondCard = playerTwo.shift()
      if (!playerOneSecondCard || !playerTwoSecondCard) {
        return {
          winner: playerOneSecondCard ? 0 : 1,
          turnResults
        }
      }

      cards.unshift(playerOneSecondCard, playerTwoSecondCard)
      continue
    }

    const winner = playerOneCard > playerTwoCard ? 0 : 1
    const winningDeck = winner === 0 ? playerOne : playerTwo
    const winningDifference = Math.abs(playerOneCard - playerTwoCard)

    // shuffling the winnings before putting them on the bottom of deck
    // to simulate the only human element of the game of war -- the somewhat
    // random order in which the winnings are gathered up; this incidentally
    // removes the horrible possibility of infinite or very large no-win loops
    winningDeck.push(...shuffle(cards))
    cards = []

    turnResults.push({
      winningDifference,
      winner
    })
  }

  return {
    winner: playerOne.length ? 0 : 1,
    turnResults
  }
}

function getDeck () {
  const suit = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  return [...suit, ...suit, ...suit, ...suit]
}

function deal (deck) {
  return {
    playerOne: deck.slice(0, 26),
    playerTwo: deck.slice(26)
  }
}
