import { Direction } from "../utils/Direction";
import { Dijkstras, DijkstrasNode } from "../utils/dijkstras";
import { Grid, GridNode } from "../utils/grid";
import { Utils } from "../utils/utils";

let answer = 0;
let row = 0;
const grid = new Grid<DijkstrasNode>();
const dijkstras = new Dijkstras(grid);

// interface History {
// 	direction: Direction,
// 	stepCounter: number,
// 	prevoiusNode: DijkstrasNode
// };
// const historyMap = new Map<string, History>(); 

dijkstras.setAdjacentSelector(currentNode => {
	let adjacentNodes = grid.getAdjacentItems(currentNode.column, currentNode.row)
		.filter(nextNode => nextNode.row == currentNode.row || nextNode.column == currentNode.column)
		.filter(nextNode => {
			if (nextNode.explored) {
				return false;
			}

			const sourceNodes: DijkstrasNode[] = [nextNode, currentNode];
			let sourceNode = currentNode.sourceNode;

			while (sourceNode != null && sourceNodes.length < 5) {
				sourceNodes.push(sourceNode);
				sourceNode = sourceNode.sourceNode;
			}

			if (sourceNodes.length < 5) {
				return true;
			}

			const isOnSameRowOrColumn = sourceNodes.every(n => n.column == currentNode.column) 
				||  sourceNodes.every(n => n.row == currentNode.row);

			return !isOnSameRowOrColumn;
		})
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

		const shortestPath = dijkstras.findShortestPath(start, destination);
		answer = shortestPath[0].totalDistance - start.distance;

		grid.print(c => shortestPath.includes(c) ? "*" : c.distance.toString());
		// grid.print(c => c.distance.toString());
		console.log(`The answer is: ${answer}`);
	}
);
