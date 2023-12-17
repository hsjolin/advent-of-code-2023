import { Direction } from "../utils/Direction";
import { Dijkstras, DijkstrasNode } from "../utils/dijkstras";
import { Grid, GridNode } from "../utils/grid";
import { Utils } from "../utils/utils";

let answer = 0;
let row = 0;
const grid = new Grid<DijkstrasNode>();
const dijkstras = new Dijkstras(grid);
dijkstras.nodeEstimatedEvent((currentNode, nextNode) => {
	return true;
});

// interface History {
// 	direction: Direction,
// 	stepCounter: number,
// 	prevoiusNode: DijkstrasNode
// };
// const historyMap = new Map<string, History>(); 

dijkstras.setAdjacentSelector(currentNode => {
	let adjacentNodes = grid.getAdjacentItems(currentNode.column, currentNode.row)
		.filter(nextNode => !nextNode.explored)
		.filter(nextNode => nextNode.row == currentNode.row || nextNode.column == currentNode.column)
		.filter(nextNode => {
			let counter = 0;
			let node = nextNode.sourceNode;
			if (!node) {
				return true;
			}
			const direction = node.column == nextNode.column ? Direction.down : Direction.right;
			while(true) {
				if (direction == Direction.down && node.column == nextNode.column 
					|| direction == Direction.right && node.row == nextNode.row) {
					counter++;
				}
				else {
					return true;
				}

				if (counter == 3) {
					return false;
				}

				node = node.sourceNode;
			}
		});
	
	
	return adjacentNodes;
});

Utils.lineReader<string>(
	"src/17/input.txt",
	/(\d+)/,
	match => {
		var arr = match[1].split("").map((s, col) =>
		({
			distance: parseInt(s),
			column: col,
			row,
		} as DijkstrasNode));
		for (let i = 0; i < arr.length; i++) {
			grid.set(arr[i].column, arr[i].row, arr[i]);
		}
		row++;
		return null;
	},
	result => {
		answer = 0;
		const start = grid.getItemAt(0, 0);
		const destination = grid.getItemAt(grid.columns - 1, grid.rows - 1);
		
		// historyMap["0-0"] = {
		// 	previousNode: null,
		// 	direction: null,
		// 	stepCounter: 0
		// };

		const shortestPath = dijkstras.findShortestPath(start, destination);
		answer = shortestPath[0].totalDistance;

		grid.print(c => shortestPath.includes(c) ? "*" : c.distance.toString());
		console.log(`The answer is: ${answer}`);
	}
);
