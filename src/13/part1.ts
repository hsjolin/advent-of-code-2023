import { relative } from "path";
import { Grid, GridNode } from "../utils/grid";
import { Utils } from "../utils/utils";

let answer = 0;
let currentGrid: Grid<Node> = new Grid<Node>();
let row = 0;

interface Node extends GridNode {
	symbol: string
}

interface Checksum {
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
			const checksums = calculateChecksums(grid);
			const reflection =
				findReflectionIndex(checksums.filter(c => c.direction == "r")) ??
				findReflectionIndex(checksums.filter(c => c.direction == "c"));

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

function calculateChecksums(grid: Grid<Node>): Checksum[] {
	const result: Checksum[] = [];
	for (let columnIndex = 0; columnIndex < grid.columns; columnIndex++) {
		const columnItems = grid.getColumnAt(columnIndex);
		result.push({ value: calculateChecksum(columnItems), direction: "c", index: columnIndex });
	}

	for (let rowIndex = 0; rowIndex < grid.rows; rowIndex++) {
		const rowItems = grid.getRowAt(rowIndex);
		result.push({ value: calculateChecksum(rowItems), direction: "r", index: rowIndex });
	}

	return result;
}

function calculateChecksum(nodes: Node[]): number {
	let checksum = 0;
	nodes.forEach((node, index) => {
		const b = Math.pow(2, index);
		checksum += (node.symbol == "#" ? 1 : 0) * b;
	});

	return checksum;
}

function findReflectionIndex(checksums: Checksum[]): Checksum {
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