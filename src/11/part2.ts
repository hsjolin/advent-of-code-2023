import { Grid, GridNode } from "../utils/grid";
import { Utils } from "../utils/utils";

interface SpaceObject extends GridNode {
	galaxy: boolean;
	number: number;
}

let answer = 0;
const grid = new Grid<SpaceObject>();
let row = 0;
let galaxyCount = 0;

Utils.lineReader<string>(
	"src/11/input.txt",
	/(.+)/,
	match => {
		const spaces = match[1]
			.split("")
			.map((s, column) => ({ row, column, galaxy: s == "#", number: s == "#" ? ++galaxyCount : null } as SpaceObject));
		spaces.forEach(s => grid.set(s.column, s.row, s));
		row++;
		return null;
	},
	result => {
		answer = 0;
		const galaxies = grid.filter(s => s.galaxy);
		answer = makePairSum([...galaxies], 1000000, getExpandedRows(grid), getExpandedColumns(grid));
		grid.print(s => getChar(s));
		console.log(`The answer is: ${answer}`);
	}
);
function getChar(s: SpaceObject): string {
	if (s.galaxy) {
		return "#";
	}

	return ".";
}

function getExpandedRows(grid: Grid<SpaceObject>): number[] {
	const result: number[] = [];
	for (let rowIndex = 0; rowIndex < grid.rows; rowIndex++) {
		const row = grid.getRowAt(rowIndex);
		if (!row.every(r => !r.galaxy)) {
			continue;
		}

		result.push(rowIndex);
	}

	return result;
}

function getExpandedColumns(grid: Grid<SpaceObject>): number[] {
	const result: number[] = [];
	for (let colIndex = 0; colIndex < grid.columns; colIndex++) {
		const column = grid.getColumnAt(colIndex);
		if (!column.every(r => !r.galaxy)) {
			continue;
		}

		result.push(colIndex);
	}

	return result;
}

function makePairSum(galaxies: SpaceObject[], multiplyer: number, expandedRows: number[], expandedColumns: number[]): number {
	if (galaxies.length == 0) {
		return 0;
	}

	const galaxy = galaxies.pop();
	let distanceSum = 0;
	for (let i = 0; i < galaxies.length; i++) {
		const otherGalaxy = galaxies[i];
		let columnMultiplier = 0;
		let rowMultiplier = 0;
		expandedColumns.forEach((col) => {
			if (between(col, otherGalaxy.column, galaxy.column)) {
				columnMultiplier++;
			}
		});

		expandedRows.forEach((row) => {
			if (between(row, otherGalaxy.row, galaxy.row)) {
				rowMultiplier++;
			}
		});

        const cDiff = Math.abs(otherGalaxy.column - galaxy.column) + (multiplyer - 1) * rowMultiplier;
        const rDiff = Math.abs(otherGalaxy.row - galaxy.row) + (multiplyer - 1) * columnMultiplier;

		distanceSum += (cDiff + rDiff);
	}

	return distanceSum + makePairSum(galaxies, multiplyer, expandedRows, expandedColumns);
}

function between(number: number, number1: number, number2: number): boolean {
	const floor = number1 < number2 ? number1 : number2;
	const ceil = number1 < number2 ? number2 : number1;

	return number <= ceil && number >= floor;
}

