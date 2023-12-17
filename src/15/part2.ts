import StringReader from "../utils/stringReader";
import { Utils } from "../utils/utils";

let answer = 0;
const boxes: Box[] = [];

interface LensOperation {
	label: string;
	focalLength: number;
	operation: string;
}

class Box {
	number: number;
	lenses: LensOperation[];
	constructor(number: number) {
		this.number = number;
		this.lenses = [];
	}
	toString(): string {
		return this.lenses
			.map(lens => `${lens.label}: ${lens.focalLength} box: ${this.number}`)
			.join("\r\n");
	}

	calculatePower(): number {
		let power = 0;
		for (let i = 0; i < this.lenses.length; i++) {
			const lens = this.lenses[i];
			power += (this.number + 1) * (i + 1) * lens.focalLength;

			console.log(`${lens.label}: ${this.number + 1} focal length: ${lens.focalLength}`);
		}

		return power;
	}

	applyLens(lens: LensOperation) {
		const lensIndex = this.lenses.findIndex(l => l.label == lens.label);
		if (lens.operation == "-" && lensIndex >= 0) {
			this.lenses.splice(lensIndex, 1);
		}

		if (lens.operation == "=") {
			if (lensIndex >= 0) {
				this.lenses.splice(lensIndex, 1, lens);
			} else {
				this.lenses.push(lens);
			}
		}
	}
}

Utils.lineReader<string>(
	"src/15/input.txt",
	/(.+)/,
	match => {
		return match[1];
	},
	result => {
		answer = 0;
		for (let i = 0; i < 256; i++) {
			boxes.push(new Box(i));
		}

		const lenses = result[0]
			.split(",")
			.map(s => {
				const match = s.match(/([a-z]+)(=?-?)(\d+)?/);
				const focalLength = match[3] ? parseInt(match[3]) : null;
				const operation = match[2];
				const label = match[1];

				return {
					label,
					focalLength,
					operation,
				} as LensOperation;
			});

		lenses.forEach(lens => boxes[hash(lens.label)].applyLens(lens));

		for (let i = 0; i < boxes.length; i++) {
			const box = boxes[i];
			answer += box.calculatePower();
		}

		console.log(`The answer is: ${answer}`);
	}
);

function hash(string: string): number {
	const reader = new StringReader(string);
	let hash = 0;
	while (!reader.isEOL()) {
		hash += reader.getAsciiCode();
		hash *= 17;
		hash = hash % 256;
		reader.read(1);
	}

	return hash;
}

