import { Utils } from "../utils/utils";

let answer = 0;
let instructions: string[];

class Node {
	name: string;
	left: string;
	right: string;

	constructor(name: string, left: string, right: string) {
		this.name = name;
		this.left = left;
		this.right = right;
	}

	startNode(): boolean {
		return this.name == "AAA";
	}

	endNode(): boolean {
		return this.name == "ZZZ";
	}
}

Utils.lineReader<Node>(
	"src/08/input.txt",
	/([RL]{4,})|(?:([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\))/,
	match => {
		if (match[1]) {
			instructions = match[1].split("");
			return null;
		}

		return new Node (match[2], match[3], match[4]);
	},
	result => {
		let index = 0;
		let currentNode = result.find(node => node.startNode());

		while(true) {
			const instruction = instructions[index];
			
			currentNode = instruction == "L" 
				? result.find(node => node.name == currentNode.left)
				: result.find(node => node.name == currentNode.right);
			
			answer++;	
			console.log(`Current node: ${currentNode.name}. Step: ${answer}`);
			if (currentNode.endNode()) {
				break;
			}
			
			if (++index == instructions.length) {
				index = 0;
			}
		}

		console.log(`The answer is: ${answer}`);
	}
);
