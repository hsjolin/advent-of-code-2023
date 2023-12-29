import { Dijkstras, DijkstrasNode } from "../utils/dijkstras";
import { Grid } from "../utils/grid";
import { Utils } from "../utils/utils";

let answer = 0;
let row = 0;
const grid = new Grid<DijkstrasNode>();
const dijkstras = new Dijkstras(grid);

dijkstras.setAdjacentSelector(currentNode => grid.getAdjacentItems(currentNode.column, currentNode.row)
	.filter(nextNode => nextNode.row == currentNode.row || nextNode.column == currentNode.column)
	.filter(nextNode => {
		const nodes: DijkstrasNode[] = [nextNode];
		let sourceNode = currentNode;

		while (true) {
			nodes.push(sourceNode);

			if (nodes.length == 5) {
				break;
			}

			if (sourceNode.sourceNode == null) {
				return true;
			}

			sourceNode = sourceNode.sourceNode;
		}

		if (nodes.every(n => n.column == nextNode.column) ||
			nodes.every(n => n.row == nextNode.row)) {
			return false;
		}

		return true;
}));

Utils.lineReader<string>(
	"src/17/input.txt",
	/(\d+)/,
	match => {
		var arr = match[1].split("").map(
			(s, col) =>
			({
				distance: parseInt(s),
				column: col,
				row,
			} as DijkstrasNode)
		);
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

		grid.print(c => getChar(c));
		console.log(`The answer is: ${answer}`);
	}
);

function getChar(c: DijkstrasNode): string {
	if (c.shortestPathNode) {
		return "*";
	}

	if (c.explored) {
		return ".";
	}

	return c.distance.toString();
}
