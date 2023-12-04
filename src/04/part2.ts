import { Grid, GridNode } from "../utils/grid";
import StringReader from "../utils/stringReader";
import { Utils } from "../utils/utils";

let answer = 0;

interface MachineNode extends GridNode {
  symbol: string;
  isNumber: boolean;
}

interface GearSegments {
  nodes1: MachineNode[];
  nodes2: MachineNode[];
}

const grid = new Grid<MachineNode>();
let row = 0;

Utils.lineReader<string>(
  "src/03/input.txt",
  /^.*$/,
  (match) => {
    let column = 0;
    const line = match[0];
    const stringReader = new StringReader(line);
    while (!stringReader.isEOL()) {
      const char = stringReader.read(1);

      if (char != ".") {
        grid.set(column, row, {
          column,
          row,
          symbol: char,
          isNumber: !isNaN(+char),
        });
      }

      column++;
    }

    row++;
    return line;
  },
  (lines) => {
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.columns + 1; c++) {
        const item = grid.getItemAt(c, r);
        if (item?.symbol != "*") {
          continue;
        }

        const adjacentNumberSegments = findAdjacentGearSegments(item, grid);
        if (!adjacentNumberSegments) {
          continue;
        }

        answer +=
          parseInt(
            adjacentNumberSegments.nodes1.map((item) => item.symbol).join("")
          ) *
          parseInt(
            adjacentNumberSegments.nodes2.map((item) => item.symbol).join("")
          );
      }
    }
    console.log(`The answer is: ${answer}`);
  }
);

function findAdjacentGearSegments(
  item: MachineNode,
  grid: Grid<MachineNode>
): GearSegments {
  const adjacentNumbers = grid
    .getAdjacentItems(item.column, item.row)
    .filter((i) => i.isNumber);

  if (adjacentNumbers.length < 2) {
    return null;
  }

  const gearSegments: GearSegments = {
    nodes1: [],
    nodes2: [],
  };

  for (let i = 0; i < adjacentNumbers.length; i++) {
    const number = adjacentNumbers[i];
    if (gearSegments.nodes1.length == 0) {
      gearSegments.nodes1 = getSegmentForNumber(number);
      continue;
    }

    if (gearSegments.nodes1.includes(number)) {
      continue;
    }

    if (gearSegments.nodes2.length == 0) {
      gearSegments.nodes2 = getSegmentForNumber(number);
      continue;
    }

    if (gearSegments.nodes2.includes(number)) {
      continue;
    }

    return null;
  }
  if (gearSegments.nodes1.length > 0 && gearSegments.nodes2.length > 0) {
    return gearSegments;
  }

  return null;
}

function getSegmentForNumber(number: MachineNode): MachineNode[] {
  const segment: MachineNode[] = [];
  let startCol = number.column;
  while (true) {
    if (!grid.getItemAt(startCol - 1, number.row)?.isNumber) {
      break;
    }
    startCol--;
  }
  segment.push(grid.getItemAt(startCol, number.row));

  while (true) {
    if (!grid.getItemAt(++startCol, number.row)?.isNumber) {
      break;
    }
    segment.push(grid.getItemAt(startCol, number.row));
  }

  return segment;
}
