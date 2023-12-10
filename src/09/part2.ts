import { Utils } from "../utils/utils";

let answer = 0;

class Values {
	values: number[];
	length: number;
	constructor(values: number[]) {
		this.values = values;
		this.length = values.length;
	}
	
	last(): number {
		return this.values[this.values.length - 1];
	}

	first(): number {
		return this.values[0];
	}

	getNext(): number[] {
		const result: number[] = [];
		for (let i = 0; i < this.values.length - 1; i++) {
			const value = this.values[i+1] - this.values[i];
			result.push(value);
		}

		return result;
	}
}

Utils.lineReader<Values>(
	"src/09/input.txt",
	/(.*)/,
	match => {
		return new Values(match[1].split(/\s+/).map(v => parseInt(v)));
	},
	result => {
		answer = 0;
		for (let i = 0; i < result.length; i++) {
			const historyValues = getHistoryValuesRecursive([result[i]]);
			answer += historyValues[historyValues.length - 1];
		}

		console.log(`The answer is: ${answer}`);
	}
);

function getHistoryValuesRecursive(values: Values[]): number[] {
	if (values[values.length - 1].values.every(v => v == 0)) {
		const result = [];
		for(let i = values.length - 1; i > 0; i--) {
			const currentValue = values[i];
			const nextValue = values[i - 1];
			if (i == values.length - 1) {
				currentValue.values = [0, ...currentValue.values];
			}
			const historyValue = nextValue.first() - currentValue.first();
			nextValue.values = [historyValue, ...nextValue.values];
			result.push(historyValue);
		}

		return result;
	}

	return getHistoryValuesRecursive([...values, new Values(values[values.length - 1].getNext())]);
}

