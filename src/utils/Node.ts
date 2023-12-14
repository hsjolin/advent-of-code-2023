import { GridNode } from "./grid";

export interface Node extends GridNode {
  symbol: string;
  visited: boolean;
  startingPoint: boolean;
  outside: boolean;
  path: boolean;
}
