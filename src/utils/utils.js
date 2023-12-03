// import fetch from 'node-fetch';
const fs = require('fs');
const readLine = require('readline');

module.exports = class Utils {
	static lineReader(file, lineCallback, completeCallback) {
		const fileStream = fs.createReadStream(file);
		const lineReader = readLine.createInterface({
			input: fileStream,
			crlfDelay: Infinity,
		});

		let lines = [];
		lineReader
			.on("line", line => {
				lineCallback(line);
				lines.push(line);
			})
			.on("close", () => {
				completeCallback(lines);
			});
	}

	static readFile(file, completeCallback) {
		fs.readFile(file, "utf8", (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			completeCallback(data);
		});
	}

	static parseFile(file, regex, matchCallback, completeCallback) {
		const fileStream = fs.createReadStream(file);
		const lineReader = readLine.createInterface({
			input: fileStream,
			crlfDelay: Infinity,
		});

		const results = [];
		lineReader
			.on("line", line => {
				const match = line.match(regex);

				if (match) {
					results.push(matchCallback(match));
				}
			})
			.on("close", () => {
				if (completeCallback) {
					completeCallback(results);
				}
			});
	}

	static readFileSync(file) {
		return fs.readFileSync(file, "utf8");
	}

	static fileWriter(file, data) {
		fs.writeFileSync(file, data);
	}

	static appendFile(file, data) {
		fs.appendFileSync(file, data, "utf8");
	}

	static replaceFile(target, source) {
		fs.unlinkSync(target);
		fs.renameSync(source, target);
	}

	static interval(a, b, arr) {
		if (a > b) {
			throw "WTF!";
		}

		if (a == b) {
			return arr; 
		}

		arr = arr || [];
		return Utils.interval(a + 1, b, [...arr, a]);
	}

	static sortArray(arr) {
		return [...arr].sort((a, b) => (a < b ? -1 : a === b ? 0 : 1));
	}

  static sortArrayDesc(arr) {
		return [...arr].sort((a, b) => (a < b ? 1 : a === b ? 0 : -1));
	}
};

