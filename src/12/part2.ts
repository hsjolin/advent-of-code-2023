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
		const numbers = match[2].split(",").map(s => parseInt(s));
		return {
			springRecords: match[1] + "?" + match[1] + "?" + match[1] + "?" + match[1] + "?" + match[1],
			brokenSpringNumbers: numbers.concat(numbers).concat(numbers).concat(numbers).concat(numbers)
		};
	},
	result => {
		answer = 0;
		result.forEach(r => console.log(`${r.springRecords} ${r.brokenSpringNumbers}`));
		result.forEach(r => {
			if (answer % 1000 == 0) {
				console.log(`Found ${answer} combinations so far...`);
			}
			answer += getNumberOfArrangments(r);
		});
		console.log(`The answer is: ${answer}`);
	}
);

function getNumberOfPossibleCombinations(
	record: ConditionRecord, 
	position: number = 0, 
	binaryString: string = "",
	index: number = 0): number {

	const reader = new StringReader(record.springRecords);
	const binaryStringReader = new StringReader(binaryString);
	binaryStringReader.position = position;
	reader.position = position;

	if (reader.isEOL()) {
		return 1;
	}

	const currentBrokenSpringNumber = record.brokenSpringNumbers[index];
	const recentBrokenSprings = binaryStringReader.readLeftUntil(s => s != "#") ?? "";
	if (recentBrokenSprings.length > currentBrokenSpringNumber) {
		return 0;
	}
	
	const char = reader.read(1);
	switch (char) {
		case "?":
			return getNumberOfPossibleCombinations(record, position + 1, binaryString + "#", index) 
				+ getNumberOfPossibleCombinations(record, position + 1, binaryString + ".", index);
		case ".":
			if (recentBrokenSprings.length > 0) {
				index++;
			}
			return getNumberOfPossibleCombinations(record, position + 1, binaryString + ".", index);
		case "#":
			return getNumberOfPossibleCombinations(record, position + 1, binaryString + "#", index);
		default:
			throw Error(`WTF! ${char} is not a valid character`);
	}
}

function getNumberOfArrangments(record: ConditionRecord): number {
	let result = 0;
	result = getNumberOfPossibleCombinations(record);
	return result;
}