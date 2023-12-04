import { Grid, GridNode } from "../utils/grid";
import StringReader from "../utils/stringReader";
import { Utils } from "../utils/utils";

let answer = 0;

interface MachineNode extends GridNode {
  symbol: string;
  isNumber: boolean;
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
      let numberSegment: MachineNode[] = null;

      for (let c = 0; c < grid.columns + 1; c++) {
        const item = grid.getItemAt(c, r);
        if (!item?.isNumber && numberSegment != null) {
          const adjacentSymbol = findFirstAdjacentSymbol(numberSegment, grid);
          if (adjacentSymbol) {
            answer += parseInt(numberSegment.map((i) => i.symbol).join(""));
          }

          numberSegment = null;
        } else if (item?.isNumber) {
          numberSegment ??= [];
          numberSegment.push(item);
        }
      }
    }
    console.log(`The answer is: ${answer}`);
  }
);

function findFirstAdjacentSymbol(
  numberSegment: MachineNode[],
  grid: Grid<MachineNode>
): MachineNode {
  for (let i = 0; i < numberSegment.length; i++) {
    const adjacent = grid
      .getAdjacentItems(numberSegment[i].column, numberSegment[i].row)
      .filter((i) => i.symbol != null && !i.isNumber);
    if (adjacent.length > 0) {
      return adjacent[0];
    }
  }
}
