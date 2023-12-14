import { Grid } from "../utils/grid";
import { Utils } from "../utils/utils";
import { Direction } from "../utils/Direction";
import { Node } from "../utils/Node";
import { Walker } from "../utils/Walker";

let answer = 0;
let rowIndex = 0;

export const grid = new Grid<Node>();

Utils.lineReader<Node[]>(
  "src/10/input.txt",
  /(.+)/,
  (match) => {
    const nodeStrings = match[1].split("");
    const nodes = nodeStrings.map((s, index) => ({
      symbol: s,
      row: rowIndex,
      column: index,
      startingPoint: s == "S"
    } as Node));
    nodes.forEach((node) => grid.set(node.column, node.row, node));

    rowIndex++;
    return nodes;
  },
  (result) => {
    const walker = new Walker(grid);
    walker.currentNode = grid.find((n) => n.symbol == "S");

    while (!walker.isDoneWalking()) {
      walker.continue();
    }

    const outSideDirection = walker.leftTurns > walker.rightTurns
      ? Direction.right
      : Direction.left;

    walker.stepsWalked = 0;
    grid.filter(node => node.visited).forEach(n => n.visited = false);
    while (!walker.isDoneWalking()) {
      const previousNode = walker.currentNode;
      walker.continue();
      const nodesToCheck = [getNodeOnSide(previousNode, walker.direction, outSideDirection),
      getNodeOnSide(walker.currentNode, walker.direction, outSideDirection)]
        .filter(n => n);

      for (let i = 0; i < nodesToCheck.length; i++) {
        var outsideNode = nodesToCheck[i];
        grid.fillArea(outsideNode, function (node) {
          if (node.path || node.outside) {
            return false;
          }
          node.outside = true;
          return true;
        });
      }
    }

    const insideNodes = grid.filter(n => !n.outside && !n.path && !n.startingPoint);
    insideNodes.forEach(n => n.outside = false);
    answer = insideNodes.length;

    grid.print((node) => getSymbol(node));
    console.log(`The answer is: ${answer}`);
  }
);

function getNodeOnSide(currentNode: Node, walkingDirection: Direction, direction: Direction): Node {
  switch (walkingDirection) {
    case Direction.up:
      return direction == Direction.left
        ? grid.getItemAt(currentNode.column - 1, currentNode.row)
        : grid.getItemAt(currentNode.column + 1, currentNode.row);
    case Direction.down:
      return direction == Direction.left
        ? grid.getItemAt(currentNode.column + 1, currentNode.row)
        : grid.getItemAt(currentNode.column - 1, currentNode.row);
    case Direction.left:
      return direction == Direction.left
        ? grid.getItemAt(currentNode.column, currentNode.row + 1)
        : grid.getItemAt(currentNode.column, currentNode.row - 1);
    case Direction.right:
      return direction == Direction.left
        ? grid.getItemAt(currentNode.column, currentNode.row - 1)
        : grid.getItemAt(currentNode.column, currentNode.row + 1);
  }
}

function getSymbol(node: Node): string {
  if (node.outside === false) {
    return "I";
  }

  if (node.outside === true) {
    return "O";
  }

  switch (node.symbol) {
    case "-":
      return "─";
    case "7":
      return "┐";
    case "J":
      return "┘";
    case "L":
      return "└";
    case "F":
      return "┌";
    case "|":
      return "│";
    default:
      return node.symbol;
  }
}
