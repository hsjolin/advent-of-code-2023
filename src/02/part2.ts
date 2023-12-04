import StringReader from "../utils/stringReader";
import { Utils } from "../utils/utils";

let answer = 0;
interface Game {
  id: string;
  power: number;
}

Utils.lineReader<Game>(
  "src/02/input.txt",
  /Game (\d+): (.*)/,
  (match) => {
    const gameId = match[1];
    const drawString = match[2];
    const draws = drawString.split("; ");

    const game: Game = { id: gameId, power: 0 };
    let redMax = 0;
    let blueMax = 0;
    let greenMax = 0;
	
    for (let i = 0; i < draws.length; i++) {
      const results = draws[i].split(", ");
      for (let j = 0; j < results.length; j++) {
        const number = parseInt(results[j].split(" ")[0]);
        const color = results[j].split(" ")[1];

        switch (color) {
          case "red":
            if (redMax >= number) {
              continue;
            }
            redMax = number;
            break;
          case "blue":
            if (blueMax >= number) {
              continue;
            }
            blueMax = number;
            break;
          case "green":
            if (greenMax >= number) {
              continue;
            }
            greenMax = number;
            break;
        }
      }
      game.power = blueMax * greenMax * redMax;
    }

    return game;
  },
  (games) => {
    for (let i = 0; i < games.length; i++) {
      answer += games[i].power;
    }

    console.log(`The answer is: ${answer}`);
  }
);
