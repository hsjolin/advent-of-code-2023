import { Grid } from "./grid";
import { Direction } from "./Direction";
import { Node } from "./Node";

export class Walker {
  leftIsOutside: boolean;
  stepsWalked: number = 0;
  currentNode: Node;
  outsideNodes: Node[] = [];
  leftTurns: number = 0;
  rightTurns: number = 0;
  direction: Direction;
  grid: Grid<Node>;
  turns: string[] = ["7", "J", "F", "L"];

  constructor(grid: Grid<Node>) {
    this.grid = grid;
  }

  continue() {
    const adjacent = this.grid
      .getAdjacentItems(this.currentNode.column, this.currentNode.row)
      .filter((node) => this.canWalkTo(node));

    if (this.currentNode.startingPoint && adjacent.length != 2) {
      throw Error("WFT! Should have two directions when on starting point");
    }

    if (!this.currentNode.startingPoint && adjacent.length != 1) {
      throw Error("WFT! Walker is stuck or have multiple ways to choose from!");
    }

    const nextNode = adjacent[0];
    this.direction = this.calculateDirection(this.currentNode, nextNode);
    if (this.direction == Direction.left && this.turns.includes(this.currentNode.symbol)) {
      this.leftTurns++;
    } else if (this.direction == Direction.right && this.turns.includes(this.currentNode.symbol)) {
      this.rightTurns++;
    }

    this.currentNode.visited = !this.currentNode.startingPoint;
    this.currentNode.path = true;
    this.currentNode = adjacent[0];
    this.stepsWalked++;
  }

  isDoneWalking(): boolean {
    if (this.currentNode.startingPoint && this.stepsWalked > 0) {
      return true;
    }

    return false;
  }

  getNodeOnSide(currentNode: Node, direction: Direction): Node {
    switch (this.direction) {
      case Direction.up:
        return direction == Direction.left
          ? this.grid.getItemAt(currentNode.column - 1, currentNode.row)
          : this.grid.getItemAt(currentNode.column + 1, currentNode.row);
      case Direction.down:
        return direction == Direction.left
          ? this.grid.getItemAt(currentNode.column + 1, currentNode.row)
          : this.grid.getItemAt(currentNode.column - 1, currentNode.row);
      case Direction.left:
        return direction == Direction.left
          ? this.grid.getItemAt(currentNode.column, currentNode.row + 1)
          : this.grid.getItemAt(currentNode.column, currentNode.row - 1);
      case Direction.right:
        return direction == Direction.left
          ? this.grid.getItemAt(currentNode.column, currentNode.row - 1)
          : this.grid.getItemAt(currentNode.column, currentNode.row + 1);
    }
  }
  
  private calculateDirection(currentNode: Node, nextNode: Node): Direction {
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

  private canWalkTo(node: Node): boolean {
    if (node.visited) {
      return false;
    }

    if (node.startingPoint && this.stepsWalked <= 1) {
      return false;
    }

    const direction = this.calculateDirection(this.currentNode, node);
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
