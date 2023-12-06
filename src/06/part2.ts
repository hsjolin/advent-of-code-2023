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
      times = [parseInt(match[1]
        .replace(/\s+/g, ""))];
    }

    if (match[2]) {
      distances = [parseInt(match[2]
        .replace(/\s+/g, ""))];

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
