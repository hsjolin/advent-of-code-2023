import StringReader from "../utils/stringReader";
import { Utils } from "../utils/utils";

let answer = 0;
interface Pair {
  number1 : string,
  number2 : string
}

const numberStrings = [
	'zero',
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine',
  ];  

Utils.lineReader<Pair>(
  "src/01/input.txt",
  /^.*$/,
  (match) => {
    const stringReader = new StringReader(match[0]);
    stringReader.readUntil(_ => getNumberRight(stringReader) != null);
    const number1 = getNumberRight(stringReader);
    stringReader.position = match[0].length;
    stringReader.readLeftUntil(_ => getNumberLeft(stringReader) != null);
    const number2 = getNumberLeft(stringReader);

    return {
      number1: number1,
      number2: number2
    };
  },
  (pairs) => {
    for(let i = 0; i < pairs.length; i++) {
      answer += parseInt(pairs[i].number1 + pairs[i].number2);
    }
    
    console.log(`The sum is: ${answer}`);
  });

function getNumberRight(stringReader: StringReader) : string {
	const currentChar = stringReader.string[stringReader.position];
	if (!isNaN(+currentChar)) {
		return currentChar;
	}

	for(let i = 0; i < numberStrings.length; i++) {
		if (stringReader.lookRight(numberStrings[i])) {
			return i.toString();
		}
	}

	return null;
}

function getNumberLeft(stringReader: StringReader) : string {
	const currentChar = stringReader.string[stringReader.position];
	if (!isNaN(+currentChar)) {
		return currentChar;
	}

	for(let i = 0; i < numberStrings.length; i++) {
		if (stringReader.lookLeft(numberStrings[i])) {
			return i.toString();
		}
	}

	return null;
}

