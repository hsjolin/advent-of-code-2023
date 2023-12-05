import { Interval } from "../utils/interval";
import { Utils } from "../utils/utils";

const targetDestinationType = "location";

let answer = 0;
let seeds: number[];
let pendingMapper: Mapper;

class Mapper {
  destinationRanges: Interval[] = [];
  sourceRanges: Interval[] = [];
  mapsFrom: string;
  mapsTo: string;

  map(seed: number): number {
    const rangeIndex = this.sourceRanges.findIndex(i => i.includes(new Interval(seed, seed)));
    if (rangeIndex == -1) {
      return seed;
    }

    const sourceRange = this.sourceRanges[rangeIndex];
    const rangeStartDiff = seed - sourceRange.start;
    const destinationRange = this.destinationRanges[rangeIndex];

    return destinationRange.start + rangeStartDiff;
  }
}

Utils.lineReader<Mapper>(
  "src/05/input.txt",
  /(?:seeds: ([\d ]+))|(?:([a-z]+)-to-([a-z]+) map:)|(?:(\d+) (\d+) (\d+))/,
  (match) => {
    if (match[1]) {
      seeds = match[1].split(" ").map((str) => parseInt(str));
      return null;
    }

    if (match[2] && match[3]) {
      const newMapper = new Mapper();
      newMapper.mapsFrom = match[2];
      newMapper.mapsTo = match[3];

      const completeMapper = pendingMapper;
      pendingMapper = newMapper;

      return completeMapper;
    }

    if (match[4] && match[5] && match[6] && pendingMapper) {
      const destinationRangeStart = parseInt(match[4]);
      const sourceRangeStart = parseInt(match[5]);
      const rangeLength = parseInt(match[6]);

      pendingMapper.destinationRanges.push(
        new Interval(destinationRangeStart, destinationRangeStart + rangeLength)
      );

      pendingMapper.sourceRanges.push(
        new Interval(sourceRangeStart, sourceRangeStart + rangeLength)
      );

      return null;
    }

    throw Error("WTF? Should not end up here!");
  },
  (mappers) => {
    mappers.push(pendingMapper);

    let lowestDestinationTypeSeed: number = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      let currentType: string = "seed";
      let mappedSeed: number = seed;
      while (currentType != targetDestinationType) {
        const mapper = mappers.filter((m) => m.mapsFrom == currentType)[0];
        currentType = mapper.mapsTo;
        mappedSeed = mapper.map(mappedSeed);
      }
      if (mappedSeed < lowestDestinationTypeSeed) {
        lowestDestinationTypeSeed = mappedSeed;
      }
    }
    answer = lowestDestinationTypeSeed;
    console.log(`The answer is: ${answer}`);
  }
);
