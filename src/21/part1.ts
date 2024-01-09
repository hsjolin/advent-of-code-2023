import { Grid, GridNode } from "../utils/grid";
import { Utils } from "../utils/utils";

const numberOfSteps = 64;
const grid: Grid<Node> = new Grid<Node>();

let answer = 0;
let row = 0;
let df = numberOfSteps % 2 != 0;

interface Node extends GridNode {
	symbol: string;
	isStartingPoint: boolean;
	visited: boolean;
	reachable: boolean
}

Utils.lineReader<string>(
	"src/21/input.txt",
	/(.+)/,
	match => {
		const rowItems: Node[] = match[1].split("").map((s, column) => {
			df = !df;
			return { symbol: s, column, row, isStartingPoint: s == "S", visited: s == "S", reachable: false }
		});
		rowItems.forEach(item => grid.set(item.column, item.row, item));
		row++;
		return null;
	},
	result => {
		// walk(startingPoint, startingPoint);
		const startingPoint = grid.find(n => n.isStartingPoint);

		grid.fillArea(startingPoint, node => {
			if (grid.getManhattanDistance(startingPoint, node) > numberOfSteps) {
				return false;
			}

			if (node.reachable || node.symbol == "#") {
				return false;
			}

			node.reachable = true;
			return true;
		});

		const endPoints = grid.filter(n => n.reachable || n.isStartingPoint);
		grid.print(n => getChar(n));
		answer = endPoints.length / 2;
		console.log(`The answer is: ${answer}`);
	}
);
function getChar(n: Node): string {
	if (n.isStartingPoint) {
		return n.symbol;
	}

	// if (n.reachable) {
	// 	return "O";
	// }

	if (n.visited) {
		return "+";
	}

	// if (n.reachable) {
	// 	return "*";
	// }

	return n.symbol;
}

function walk(point: Node, startingPoint: Node) {
	point.visited = true;

	if (grid.getManhattanDistance(point, startingPoint) > numberOfSteps) {
		return;
	}

	const adjacentPoints = grid.getAdjacentItems(point.column, point.row)
		.filter(n => (n.column == point.column || n.row == point.row) && n.visited === false);

	
	for (let index = 0; index < adjacentPoints.length; index++) {
		const adjacentPoint = adjacentPoints[index];
		walk(adjacentPoint, startingPoint);
	}
}

function calculateAnswer(): number {
	const area = (numberOfSteps * numberOfSteps) / 4 - grid.filter(n => n.symbol == "#" && n.visited).length;
	return area;
}

