import * as fs from "fs";
import * as readLine from "readline";

export class Utils {
	static lineReader = function <T>(
		file: string,
		regex: RegExp,
		lineCallback: (line: RegExpMatchArray) => T, 
		completeCallback: (values: T[]) => void
	) {
		const fileStream = fs.createReadStream(file);
		const lineReader = readLine.createInterface({
			input: fileStream,
			crlfDelay: Infinity,
		});

		let values: T[] = [];
		lineReader
			.on("line", line => {
				const match = line.match(regex);

				if (match) {
					const value = lineCallback(match);
					if (value) {
						values.push(value);
					}
				}
			})
			.on("close", () => {
				completeCallback(values);
			});
	};

	static interval(a: number, b: number, arr: number[] = null) : number[] {
		if (a > b) {
			throw "WTF!";
		}

		if (a == b) {
			return arr;
		}

		arr = arr || [];
		return Utils.interval(a + 1, b, [...arr, a]);
	};
}
