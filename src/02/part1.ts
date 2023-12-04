import StringReader from "../utils/stringReader";
import { Utils } from "../utils/utils";

let answer = 0;
interface Game {
  id: string;
  redCubes: number;
  blueCubes: number;
  greenCubes: number;
}

const maxBlueCubes = 14;
const maxGreenCubes = 13;
const maxRedCubes = 12;

Utils.lineReader<Game>(
  "src/02/input.txt",
  /Game (\d+): (.*)/,
  (match) => {
    const gameId = match[1];
    const drawString = match[2];
    const draws = drawString.split("; ");

    const game: Game = { id: gameId, greenCubes: 0, redCubes: 0, blueCubes: 0 };

    for (let i = 0; i < draws.length; i++) {
      const results = draws[i].split(", ");
      for (let j = 0; j < results.length; j++) {
        const number = parseInt(results[j].split(" ")[0]);
        const color = results[j].split(" ")[1];
        switch (color) {
          case "red":
            if (number > maxRedCubes) {
              return null;
            }
            game.redCubes = number;
            break;
          case "blue":
            if (number > maxBlueCubes) {
              return null;
            }
            game.blueCubes = number;
            break;
          case "green":
            if (number > maxGreenCubes) {
              return null;
            }
            game.greenCubes = number;
            break;
        }
      }
    }

    return game;
  },
  (games) => {
    for (let i = 0; i < games.length; i++) {
      answer += parseInt(games[i].id);
    }

    console.log(`The answer is: ${answer}`);
  }
);
