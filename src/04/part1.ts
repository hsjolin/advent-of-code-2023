import { Utils } from "../utils/utils";

let answer = 0;

class Card {
  constructor(cardId: string, winningNumbers: number[], yourNumbers: number[]) {
    this.cardId = cardId;
    this.winningNumbers.fill(-1);
    this.yourNumbers.fill(-2);

    for (let i = 0; i < winningNumbers.length; i++) {
      this.winningNumbers[winningNumbers[i]] = 1;
    }

    for (let i = 0; i < yourNumbers.length; i++) {
      this.yourNumbers[yourNumbers[i]] = 1;
    }
  }

  cardId: string;
  winningNumbers: number[] = Array(100);
  yourNumbers: number[] = Array(100);

  points(): number {
    let points = 0;
    for (let i = 0; i < this.winningNumbers.length; i++) {
      if (this.winningNumbers[i] == this.yourNumbers[i]) {
        if (points == 0) {
          points = 1;
          continue;
        }

        points *= 2;
      }
    }
    return points;
  }
}

Utils.lineReader<Card>(
  "src/04/input.txt",
  /^Card +(\d+): (.*)$/,
  (match) => {
    const cardId = match[1];
    const numberString = match[2];
    const winningNumbersString = numberString.split(" | ")[0];
    const yourNumbersString = numberString.split(" | ")[1];

    return new Card(
      cardId,
      winningNumbersString.split(" ").map((c) => parseInt(c.trim())),
      yourNumbersString.split(" ").map((c) => parseInt(c.trim()))
    );
  },
  (cards) => {
    answer = cards.map((c) => c.points()).reduce((a, b, _, __) => a + b);

    console.log(`The answer is: ${answer}`);
  }
);
