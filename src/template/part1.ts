import { Utils } from "../utils/utils";

let answer = 0;

Utils.lineReader<string>(
	"src/<lucka>/input.txt",
	/regex/,
	match => {
		return null;
	},
	result => {
		answer = 0;
		console.log("Answer", answer);
	}
);
