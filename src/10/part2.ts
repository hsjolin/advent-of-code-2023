import { Grid, GridNode } from "../utils/grid";
import { Utils } from "../utils/utils";

let answer = 0;
let rowIndex = 0;

const grid = new Grid<Node>();
interface Node extends GridNode {
  symbol: string;
  visited: boolean;
  startingPoint: boolean;
  outside: boolean;
  border: boolean;
}

enum Direction {
  left = 1,
  right = 2,
  up = 3,
  down = 4
}

const directionChars: string[] = ["7", "J", "|", "-", "F", "L", "S"];

class Walker {
  leftIsOutside: boolean;
  stepsWalked: number = 0;
  currentNode: Node;

  constructor(leftIsOutside: boolean) {
    this.leftIsOutside = leftIsOutside;
  }

  continue() {
    const adjacent = grid
      .getAdjacentItems(this.currentNode.column, this.currentNode.row)
      .filter((node) => this._canWalkTo(node));

    if (this.currentNode.startingPoint && adjacent.length != 2) {
      throw Error("WFT! Should have two directions when on starting point");
    }

    if (!this.currentNode.startingPoint && adjacent.length != 1) {
      throw Error("WFT! Walker is stuck or have multiple ways to choose from!");
    }

    const nextNode = adjacent[0];
    const direction = calculateDirection(this.currentNode, nextNode);
    const outsideNode1 = this._getOutsideNode(this.currentNode, direction, this.leftIsOutside);
    const outsideNode2 = this._getOutsideNode(nextNode, direction, this.leftIsOutside);

    if (outsideNode1 != null) {
      outsideNode1.outside = true;
    }

    if (outsideNode2 != null) {
      outsideNode2.outside = true;
    }

    this.currentNode.visited = !this.currentNode.startingPoint;
    this.currentNode.outside = null;
    this.currentNode = adjacent[0];
    this.stepsWalked++;
  }

  private _getOutsideNode(currentNode: Node, direction: Direction, leftIsOutside: boolean): Node {
    switch (direction) {
      case Direction.up:
        return leftIsOutside
          ? grid.getItemAt(currentNode.column - 1, currentNode.row)
          : grid.getItemAt(currentNode.column + 1, currentNode.row);
      case Direction.down:
        return leftIsOutside
          ? grid.getItemAt(currentNode.column + 1, currentNode.row)
          : grid.getItemAt(currentNode.column - 1, currentNode.row);
      case Direction.left:
        return leftIsOutside
          ? grid.getItemAt(currentNode.column, currentNode.row + 1)
          : grid.getItemAt(currentNode.column, currentNode.row - 1);
      case Direction.right:
        return leftIsOutside
          ? grid.getItemAt(currentNode.column, currentNode.row - 1)
          : grid.getItemAt(currentNode.column, currentNode.row + 1);
    }
  }

  isDoneWalking(): boolean {
    return this.currentNode.startingPoint && this.stepsWalked > 0;
  }

  _canWalkTo(node: Node): boolean {
    if (node.visited) {
      return false;
    }

    if (node.startingPoint && this.stepsWalked <= 1) {
      return false;
    }

    const direction = calculateDirection(this.currentNode, node);
    if (!direction) {
      return false;
    }

    if (direction == Direction.up) {
      switch (this.currentNode.symbol) {
        case "S":
        case "|":
        case "L":
        case "J":
          return (
            node.symbol == "|" ||
            node.symbol == "7" ||
            node.symbol == "F" ||
            node.symbol == "S"
          );
        default:
          return false;
      }
    }

    if (direction == Direction.down) {
      switch (this.currentNode.symbol) {
        case "S":
        case "|":
        case "7":
        case "F":
          return (
            node.symbol == "|" ||
            node.symbol == "J" ||
            node.symbol == "L" ||
            node.symbol == "S"
          );
        default:
          return false;
      }
    }

    if (direction == Direction.left) {
      switch (this.currentNode.symbol) {
        case "S":
        case "-":
        case "7":
        case "J":
          return (
            node.symbol == "-" ||
            node.symbol == "F" ||
            node.symbol == "L" ||
            node.symbol == "S"
          );
        default:
          return false;
      }
    }

    if (direction == Direction.right) {
      switch (this.currentNode.symbol) {
        case "S":
        case "-":
        case "F":
        case "L":
          return (
            node.symbol == "-" ||
            node.symbol == "7" ||
            node.symbol == "J" ||
            node.symbol == "S"
          );
        default:
          return false;
      }
    }

    throw Error("WTF! Should not end up here!");
  }
}

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
    const walker = new Walker(true);
    walker.currentNode = grid.find((n) => n.symbol == "S");

    while (!walker.isDoneWalking()) {
      walker.continue();
    }

    answer = getFilledArea(grid, grid.getItemAt(78, 71));

    grid.print((node) => getSymbol(node));
    console.log(`The answer is: ${answer}`);
  }
);

function getSymbol(node: Node): string {
  if (node.outside === false && !node.border) {
    return "I";
  }

  // if (node.outside === true && !node.border) {
  //   return "O";
  // }

  if (!node.visited) {
    return node.symbol;
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

function calculateDirection(currentNode: Node, nextNode: Node): Direction {
  if (currentNode.column < nextNode.column && currentNode.row == nextNode.row) {
    return Direction.right;
  }
  if (currentNode.column > nextNode.column && currentNode.row == nextNode.row) {
    return Direction.left;
  }
  if (currentNode.row < nextNode.row && currentNode.column == nextNode.column) {
    return Direction.down;
  }
  if (currentNode.row > nextNode.row && currentNode.column == nextNode.column) {
    return Direction.up;
  }

  return null;
}

function getFilledArea(currentGrid: Grid<Node>, currentNode: Node): number {
  if (currentNode == null) {
    return 0;
  }

  if (currentNode.outside === true) {
    return 0;
  }

  let filledArea = currentNode.border ? 0 : 1;
  if (currentNode.outside == null) {
    currentNode.outside = currentNode.border === false;
    filledArea += getFilledArea(currentGrid, currentGrid.getItemAt(currentNode.column, currentNode.row - 1));
    filledArea += getFilledArea(currentGrid, currentGrid.getItemAt(currentNode.column, currentNode.row + 1));
    filledArea += getFilledArea(currentGrid, currentGrid.getItemAt(currentNode.column - 1, currentNode.row));
    filledArea += getFilledArea(currentGrid, currentGrid.getItemAt(currentNode.column + 1, currentNode.row));
  }

  return filledArea;
}


