import { GridNode, Grid } from "./grid";

export interface DijkstrasNode extends GridNode {
	sourceNode: DijkstrasNode;
	explored: boolean;
	totalDistance: number;
	distance: number;
	shortestPathNode: boolean;
}

export class Dijkstras<T extends DijkstrasNode> {
	private estimatedNodes: T[] = [];
	private grid: Grid<T>;
	private adjacentSelector: (currentNode: T) => T[];

	constructor(grid: Grid<T>) {
		this.grid = grid;
		this.adjacentSelector = currentNode =>
			this.grid.getAdjacentItems(currentNode.column, currentNode.row);
	}

	reset() {
		this.estimatedNodes = [];
		const nodes = this.grid.filter(_ => true);
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			node.explored = false;
			node.totalDistance = Number.MAX_SAFE_INTEGER;
			node.sourceNode = null;
		}
	}

	setAdjacentSelector(selector: (currentNode: T) => T[]) {
		this.adjacentSelector = selector;
	}

	findShortestPath = (
		startNode: T,
		destinationNode: T,
		adjacentFilter: (node: T, currentNode: T) => boolean = (_, __) => true
	): T[] => {
		this.reset();

		startNode.explored = true;
		startNode.totalDistance = 0;

		let currentNode = startNode;

		while (true) {
			const adjacentNodes = this.adjacentSelector(currentNode).filter(
				n => adjacentFilter(n, currentNode)
			);

			adjacentNodes.forEach(adjecent => {
				this.estimateNode(currentNode, adjecent);
			});

			if (!this.estimatedNodes.length) {
				throw Error("EstimatedNodes is empty :-(");
			}

			let next = this.estimatedNodes.pop();
			this.exploreNode(next);
			currentNode = next;
		
			if (next == destinationNode) {
				break;
			}
		}

		let result: T[] = [];
		while (currentNode != null) {
			result.push(currentNode);
			currentNode.shortestPathNode = true;
			currentNode = currentNode.sourceNode as T;
		}

		return result;
	};

	estimateNode = (sourceNode: T, node: T) => {
		if (sourceNode == null) {
			node.totalDistance = 0;
		} else if (node.totalDistance > sourceNode.totalDistance + node.distance) {
			node.totalDistance = sourceNode.totalDistance + node.distance;
			node.sourceNode = sourceNode;
		} else {
			return;
		}

		if (node.explored === false && !this.estimatedNodes.includes(node)) {
			this.estimatedNodes.push(node);
			this.estimatedNodes.sort((a, b) => b.totalDistance - a.totalDistance);
		}
	};

	exploreNode = (node: T) => {
		node.explored = true;
	};

	draw = (result: T[]): string => {
		return result
			.reverse()
			.map(
				node =>
					"(" +
					node.column +
					", " +
					node.row +
					") Distance: " +
					node.distance +
					" Total distance: " +
					node.totalDistance +
					"\r\n"
			)
			.join("");
	};
}
