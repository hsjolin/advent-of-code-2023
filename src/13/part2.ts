import { relative } from "path";
import { Grid, GridNode } from "../utils/grid";
import { Utils } from "../utils/utils";

let answer = 0;
let currentGrid: Grid<Node> = new Grid<Node>();
let row = 0;

interface Node extends GridNode {
	symbol: string
}

interface Reflection {
	direction: string;
	index: number;
	value: number;
}

Utils.lineReader<Grid<Node>>(
	"src/13/input.txt",
	/(.*)/,
	match => {
		if (match[1].length) {
			const rowItems: Node[] = match[1].split("").map((s, column) => ({ row, column, symbol: s }));
			rowItems.forEach(n => currentGrid.set(n.column, n.row, n));
			row++;
		} else {
			const returnValue = currentGrid;
			currentGrid = new Grid<Node>();
			row = 0;
			return returnValue;
		}

		return null;
	},
	result => {
		result.push(currentGrid);

		for (let index = 0; index < result.length; index++) {
			const grid = result[index];
			const reflection =
				findReflectionIndex(grid, "c") ??
				findReflectionIndex(grid, "r");

			grid.print(n => n.symbol);
			console.log(reflection);
			console.log();
			
			answer += reflection.direction == "c" 
				? reflection.index + 1
				: (reflection.index + 1) * 100
		}

		console.log(`The answer is: ${answer}`);
	}
);

function findReflectionIndex(grid: Grid<Node>, direction: string): Reflection {
	const checksums: Reflection[] = [];

	const first = checksums[0];
	const seconds = checksums.filter(c => c.value == first.value && c.index > first.index);
	for (let i = 0; i < seconds.length; i++) {
		const second = seconds[i];
		let firstIndex = 0;
		let secondIndex = checksums.indexOf(second);
		while (true) {
			if (checksums[firstIndex++].value != checksums[secondIndex--].value) {
				break;
			} else if (firstIndex > secondIndex) {
				return checksums[secondIndex];
			}
		}
	}

	const last = checksums[checksums.length - 1];
	const thirds = checksums.filter(c => c.value == last.value && c.index < last.index);
	for (let i = 0; i < thirds.length; i++) {
		const third = thirds[i];
		let thirdIndex = checksums.indexOf(third);
		let lastIndex = checksums.length - 1;
		while (true) {
			if (checksums[thirdIndex++].value != checksums[lastIndex--].value) {
				break;
			} else if (thirdIndex > lastIndex) {
				return checksums[lastIndex];
			}
		}
	}

	return null;
}