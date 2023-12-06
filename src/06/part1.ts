import { Utils } from "../utils/utils";

let answer = 0;
let times: number[];
let distances: number[];
let races: Race[];

class Race {
  constructor(time: number, distance: number) {
    this.time = time;
    this.distance = distance;
  }

  time: number;
  distance: number;

  getPossibleLoadingTimes() : number[] {
    const times: number[] = [];
    const t1 = this.time;
    let t2 = 1;
    for(t2; t2 < t1; t2++) {
        const s = t2 * (t1 - t2);
        if (s > this.distance) {
            times.push(t2);
        }
    }

    return times;
  }
}

Utils.lineReader<string>(
  "src/06/input.txt",
  /(?:Time:\s+([\d ]+))|(?:Distance:\s+([\d ]+))/,
  (match) => {
    if (match[1]) {
      times = match[1]
        .split(" ")
        .filter((str) => str != "")
        .map((str) => parseInt(str.trim()));
    }

    if (match[2]) {
      distances = match[2]
        .split(" ")
        .filter((str) => str != "")
        .map((str) => parseInt(str.trim()));

      races = times.map((t, i) => new Race ( t, distances[i] ));
    }

    return null;
  },
  (_) => {
    answer = 1;
    for (let i = 0; i < races.length; i++) {
      answer *= races[i].getPossibleLoadingTimes().length;
    }

    console.log(`The answer is: ${answer}`);
  }
);
