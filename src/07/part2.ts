import { Utils } from "../utils/utils";

let answer = 0;

type card =
	| "A"
	| "K"
	| "Q"
	| "J"
	| "T"
	| "9"
	| "8"
	| "7"
	| "6"
	| "5"
	| "4"
	| "3"
	| "2"
	| "JOKER 1"
	| "JOKER 2";

const cards: card[] = [
	"JOKER 1",
	"JOKER 2",
	"J",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"T",
	"Q",
	"K",
	"A",
];

class Hand {
	constructor(hand: card[], bid: number) {
		this.hand = hand;
		this.bid = bid;
	}

	hand: card[];
	bid: number;
	getPoints(): number {
		const cardPoints = this.hand.map(c => cards.indexOf(c));
		const dict = {};
		for (let i = 0; i < this.hand.length; i++) {
			dict[this.hand[i]] = dict[this.hand[i]] ? dict[this.hand[i]] + 1 : 1;
		}

		let pairCount = 0;
		let threeOfAKindCount = 0;
		let fourOfAKindCount = 0;
		let jokerCount = 0;
		for (let card in dict) {
			let cardCount = dict[card];
			if (cardCount == 5) {
				// Five of a kind!
				return 6;
			}

			if (card == "J") {
				jokerCount += cardCount;
			} else if (cardCount == 4) {
				fourOfAKindCount++;
			} else if (cardCount == 3) {
				threeOfAKindCount++;
			} else if (cardCount == 2) {
				pairCount++;
			}
		}

		if (fourOfAKindCount == 1 && jokerCount == 1
			|| threeOfAKindCount == 1 && jokerCount == 2
			|| pairCount == 1 && jokerCount == 3
			|| jokerCount == 4) {
			// Five of a kind
			return 6;
		}

		if (fourOfAKindCount == 1
			|| threeOfAKindCount == 1 && jokerCount == 1
			|| pairCount == 1 && jokerCount == 2
			|| jokerCount == 3
			|| jokerCount == 4) {
			// Four of a kind
			return 5;
		}

		if (pairCount == 1 && threeOfAKindCount == 1
			|| pairCount == 2 && jokerCount == 1
			|| pairCount == 1 && jokerCount > 1) {
			// Full house
			return 4;
		}

		if (threeOfAKindCount == 1
			|| pairCount == 1 && jokerCount == 1
			|| jokerCount > 1) {
			// Three of a kind
			return 3;
		}

		if (pairCount == 2 
			|| pairCount == 1 && jokerCount > 0) {
			// Two pairs
			return 2;
		}

		if (pairCount == 1 
			|| jokerCount > 0) {
			// One pair
			return 1;
		}

		// High card
		return 0;
	}
}

Utils.lineReader<Hand>(
	"src/07/input.txt",
	/([2-9AKQJT]{5}) (\d+)/,
	match => {
		return new Hand(match[1].split("") as card[], parseInt(match[2]));
	},
	result => {
		result.sort((a, b) => compareHands(a, b));
		result.forEach((hand, index) => {
			console.log(
				`Hand: ${hand.hand}, points: ${hand.getPoints()}, bid: ${hand.bid}, rank: ${index + 1
				}`
			);
		});

		for (let i = 0; i < result.length; i++) {
			answer += result[i].bid * (i + 1);
		}

		console.log(`The answer is: ${answer}`);
	}
);

function compareHands(a: Hand, b: Hand): number {
	const aPoints = a.getPoints();
	const bPoints = b.getPoints();

	if (aPoints != bPoints) {
		return aPoints - bPoints;
	}

	for (let i = 0; i < 5; i++) {
		const aValue = cards.indexOf(a.hand[i]);
		const bValue = cards.indexOf(b.hand[i]);
		if (aValue == bValue) {
			continue;
		}

		return aValue - bValue;
	}

	return 0;
}
