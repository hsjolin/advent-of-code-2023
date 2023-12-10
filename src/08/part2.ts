import { Utils } from "../utils/utils";

let answer = 0;
let instructions: string[];
const nodeNameDict = {};
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
		return this.name.endsWith("A");
	}

	endNode(): boolean {
		return this.name.endsWith("Z");
	}
}

Utils.lineReader<Node>(
	"src/08/input.txt",
	/([RL]{4,})|(?:([A-Z0-9]{3}) = \(([A-Z0-9]{3}), ([A-Z0-9]{3})\))/,
	match => {
		if (match[1]) {
			instructions = match[1].split("");
			return null;
		}
		const node = new Node (match[2], match[3], match[4]);
		nodeNameDict[match[2]] = node;
		return node;
	},
	result => {
		let index = 0;
		let currentNodes = result.filter(node => node.startNode());

		while(true) {
			const instruction = instructions[index];
			
			currentNodes = currentNodes
				.map(node => instruction == "L" 
					? nodeNameDict[node.left] 
					: nodeNameDict[node.right]);
			
			answer++;
			if (answer % 10000000 == 0) {
				console.log(`Step: ${answer}`);
			}

			if (currentNodes.every(node => node.endNode())) {
				break;
			}
			
			if (++index == instructions.length) {
				index = 0;
			}
		}

		console.log(`The answer is: ${answer}`);
	}
);
