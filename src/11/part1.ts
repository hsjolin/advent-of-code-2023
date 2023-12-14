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
		expand(grid);
		const galaxys = grid.filter(s => s.galaxy);
		answer = makePairSum(galaxys);
		
		grid.print(s => getChar(s));
		console.log(`The answer is: ${answer}`);
	}
);
function getChar(s: SpaceObject): string {
	if (s.galaxy) {
		return s.number.toString().padStart(3, "0");
	}

	return ".";
}

function expand(grid: Grid<SpaceObject>) {
	for (let rowIndex = 0; rowIndex < grid.rows; rowIndex++) {
		const row = grid.getRowAt(rowIndex);
		if (!row.every(r => !r.galaxy)) {
			continue;
		}

		grid.insertRowAt(rowIndex++, row.map(n => ({ ...n } as SpaceObject)));
	}

	for (let colIndex = 0; colIndex < grid.columns; colIndex++) {
		const column = grid.getColumnAt(colIndex);
		if (!column.every(r => !r.galaxy)) {
			continue;
		}

		grid.insertColumnAt(colIndex++, column.map(n => ({ ...n } as SpaceObject)));
	}
}

function makePairSum(galaxies: SpaceObject[]): number {
	if (galaxies.length == 0) {
		return 0;
	}
	
	const galaxy = galaxies.pop();
	let distanceSum = 0;
	for (let i = 0; i < galaxies.length; i++) {
		const otherGalaxy = galaxies[i];
		const cDiff = Math.abs(otherGalaxy.column - galaxy.column);
		const rDiff = Math.abs(otherGalaxy.row - galaxy.row);

		distanceSum += cDiff + rDiff;
	}

	return distanceSum + makePairSum(galaxies);
}

