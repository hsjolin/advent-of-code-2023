import { Walker } from "../utils/Walker";
import { Grid } from "../utils/grid";
import { Utils } from "../utils/utils";
import { Node } from "../utils/Node";

let answer = 0;
let rowIndex = 0;

const grid = new Grid<Node>();

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
		const walker = new Walker(grid);
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
