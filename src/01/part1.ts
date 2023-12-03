import StringReader from "../utils/stringReader";
import { Utils } from "../utils/utils";

let answer = 0;
interface Pair {
  number1 : string,
  number2 : string
}

Utils.lineReader<Pair>(
  "src/01/input.txt",
  /^.*$/,
  (match) => {
    const stringReader = new StringReader(match[0]);
    stringReader.position = -1;
    stringReader.position = stringReader.searchRight(char => !isNaN(+char));
    const number1 = stringReader.read(1);
    stringReader.position = match[0].length;
    stringReader.position = stringReader.searchLeft(char => !isNaN(+char));
    const number2 = stringReader.read(1);

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