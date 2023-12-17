import StringReader from "../utils/stringReader";
import { Utils } from "../utils/utils";

let answer = 0;

Utils.lineReader<string>(
	"src/15/input.txt",
	/(.+)/,
	match => {
		return match[1];
	},
	result => {
		answer = 0;
		for(let i = 0; i < result.length; i++) {
			const strings = result[i]
				.split(",");

			strings.forEach((string) => answer += hash(string));
		}
		console.log(`The answer is: ${answer}`);
	}
);

function hash(string: string): number {
	const reader = new StringReader(string);
	let hash = 0;
	while(!reader.isEOL()) {
		hash += reader.getAsciiCode();
		hash *= 17;
		hash = hash % 256;
		reader.read(1);
	}

	return hash;
}

