import { Grid, GridNode } from "../utils/grid";
import { Utils } from "../utils/utils";

let answer = 0;
let row = 0;

const numberOfSteps = 64;
const grid: Grid<Node> = new Grid<Node>();

interface Node extends GridNode {
	symbol: string;
	isStartingPoint: boolean;
	visited: boolean;
	flag: boolean
}

Utils.lineReader<string>(
	"src/21/input.txt",
	/(.+)/,
	match => {
		const rowItems: Node[] = match[1].split("").map((s, column) => ({
			symbol: s, column, row, isStartingPoint: s == "S", visited: false, flag: false
		}));
		rowItems.forEach(item => grid.set(item.column, item.row, item));
		row++;
		return null;
	},
	result => {

		const startingPoint = grid.find(n => n.isStartingPoint);
		// walk(startingPoint, 0);
		answer = grid.fillArea(startingPoint, node => {
			node.flag = !node.flag;
			if (grid.getManhattanDistance(startingPoint, node) == numberOfSteps) {
				// node.visited = true;
				return false;
			}

			if (node.visited || node.symbol == "#") {
				return false;
			}

			node.visited = true;
			return true;
		}) / 2;

		grid.print(n => getChar(n));
		// answer = calculateAnswer();
		console.log(`The answer is: ${answer}`);
	}
);
function getChar(n: Node): string {
	if (n.isStartingPoint) {
		return n.symbol;
	}

	if (n.flag) {
		return "O";
	}

	if (n.visited) {
		return "+";
	}



	return n.symbol;
}

function walk(point: Node, step: number) {
	point.visited = true;

	if (step == numberOfSteps) {
		return;
	}

	const adjacentPoints = grid.getAdjacentItems(point.column, point.row)
		.filter(n => (n.column == point.column || n.row == point.row) && n.visited === false);

	adjacentPoints.forEach(adjacentPoint => {
		walk(adjacentPoint, step + 1);
	});
}

function calculateAnswer(): number {
	const area = (numberOfSteps * numberOfSteps) / 4 - grid.filter(n => n.symbol == "#" && n.visited).length;
	return area;
}

