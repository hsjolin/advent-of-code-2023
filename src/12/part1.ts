import StringReader from "../utils/stringReader";
import { Utils } from "../utils/utils";

let answer = 0;

interface ConditionRecord {
	springRecords: string;
	brokenSpringNumbers: number[]
}

Utils.lineReader<ConditionRecord>(
	"src/12/input.txt",
	/([?\.#]+)\s([\d,]+)/,
	match => {
		return {
			springRecords: match[1],
			brokenSpringNumbers: match[2].split(",").map(s => parseInt(s))
		};
	},
	result => {
		answer = 0;
		result.forEach(r => console.log(`${r.springRecords} ${r.brokenSpringNumbers}`));
		result.forEach(r => answer += getNumberOfArrangments(r));
		console.log(`The answer is: ${answer}`);
	}
);

function generateBinaryStrings(recordsString: string, position: number, binaryString: string): string[] {
	const reader = new StringReader(recordsString);
	reader.position = position;

	if (reader.isEOL()) {
		return [binaryString];
	}

	const char = reader.read(1);
	switch (char) {
		case "?":
			return [...generateBinaryStrings(recordsString, reader.position, binaryString + "1"),
				...generateBinaryStrings(recordsString, reader.position, binaryString + "0")];
		case ".":
			return generateBinaryStrings(recordsString, reader.position, binaryString + "1");
		case "#":
			return generateBinaryStrings(recordsString, reader.position, binaryString + "0");
		default:
			throw Error(`WTF! ${char} is not a valid character`);
	}
}

function getNumberOfArrangments(record: ConditionRecord): number {
	let result = 0;
	const binaryStringsFromSpringRecords = generateBinaryStrings(record.springRecords, 0, "");
	for (let i = 0; i < binaryStringsFromSpringRecords.length; i++) {
		const binaryString = binaryStringsFromSpringRecords[i];
		const segmentsOfBrokenSprings = binaryString.split("1").filter(s => s != "");
		if (record.brokenSpringNumbers.length != segmentsOfBrokenSprings.length) {
			continue;
		}
		
		if (segmentsOfBrokenSprings.every((str, index) => str.length == record.brokenSpringNumbers[index])) {
			result++;
		}
	}
	
	return result;
}


