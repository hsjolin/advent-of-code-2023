import { Grid, GridNode } from "../utils/grid";
import { Utils } from "../utils/utils";

let answer = 0;
let rowIndex = 0;

const grid = new Grid<Node>();
interface Node extends GridNode {
	symbol: string;
	visited: boolean;
	startingPoint: boolean;
}

class Walker {
	stepsWalked: number = 0;
	currentNode: Node;
	continue() {
		const adjacent = grid
			.getAdjacentItems(this.currentNode.column, this.currentNode.row)
			.filter(node => this.canWalkTo(node));
		
		if (this.currentNode.startingPoint && adjacent.length != 2) {
			throw Error("WFT! Should have two directions when on starting point");
		} 

		if (!this.currentNode.startingPoint && adjacent.length != 1) {
			throw Error("WFT! Walker is stuck or have multiple ways to choose from!");
		}

		this.currentNode.visited = !this.currentNode.startingPoint;
		this.currentNode = adjacent[0];
		this.stepsWalked++;
	}

	isDoneWalking(): boolean {
		return this.currentNode.startingPoint 
			&& this.stepsWalked > 0;
	}

	canWalkTo(node: Node): boolean {
		if (node.visited) {
			return false;
		}

		if (node.startingPoint && this.stepsWalked <= 1) {
			return false;
		}

		const sameColumn = node.column == this.currentNode.column;
		const sameRow = node.row == this.currentNode.row;
		if (!sameColumn && !sameRow) {
			return false;
		}

		const above = sameColumn && node.row < this.currentNode.row;
		const below = sameColumn && node.row > this.currentNode.row;
		const right = sameRow && node.column > this.currentNode.column;
		const left = sameRow && node.column < this.currentNode.column;

		if (above) {
			switch(this.currentNode.symbol) {
				case "S":
				case "|":
				case "L":
				case "J":
				return node.symbol == "|"
					|| node.symbol == "7"
					|| node.symbol == "F"
					|| node.symbol == "S";
				default: 
					return false;
			}
		}
		
		if (below) {
			switch(this.currentNode.symbol) {
				case "S":
				case "|":
				case "7":
				case "F":
				return node.symbol == "|"
					|| node.symbol == "J"
					|| node.symbol == "L"
					|| node.symbol == "S";
				default: 
					return false;
			}
		}
		
		if (left) {
			switch(this.currentNode.symbol) {
				case "S":
				case "-":
				case "7":
				case "J":
				return node.symbol == "-"
					|| node.symbol == "F"
					|| node.symbol == "L"
					|| node.symbol == "S";
				default: 
					return false;
			}
		}

		if (right) {
			switch(this.currentNode.symbol) {
				case "S":
				case "-":
				case "F":
				case "L":
				return node.symbol == "-"
					|| node.symbol == "7"
					|| node.symbol == "J"
					|| node.symbol == "S";
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
	match => {
		const nodeStrings = match[1].split("");
		const nodes = nodeStrings.map((s, index) => ({symbol: s, row: rowIndex, column: index, startingPoint: s == "S"} as Node));
		nodes.forEach(node => grid.set(node.column, node.row, node));
		
		rowIndex++;
		return nodes;
	},
	result => {
		const walker = new Walker();
		walker.currentNode = grid.find(n => n.symbol == "S");

		try {
			while(!walker.isDoneWalking()) {
				walker.continue();
			}
		} catch (e) {
			console.log(e.message);
		}

		grid.print(node => getSymbol(node));
		answer = Math.round(walker.stepsWalked / 2);

		console.log(`The answer is: ${answer}`);
	}
);

function getSymbol(node: Node): string {
	if(node.visited) {
		return "*";
	}

	return node.symbol;
}
