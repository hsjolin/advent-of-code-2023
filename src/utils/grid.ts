export interface GridNode {
	row: number;
	column: number;
}

export class Grid<T extends GridNode> {
	private items: Map<string, T> = new Map<string, T>();
	private rowMax = Number.MIN_SAFE_INTEGER;
	private rowMin = Number.MAX_SAFE_INTEGER;
	private columnMax = Number.MIN_SAFE_INTEGER;
	private columnMin = Number.MAX_SAFE_INTEGER;

	rows: number = 0;
	columns: number = 0;

	private key(column: number, row: number): string {
		return `${column}:${row}`;
	}

	getColumnAt(column: number): T[] {
		return this.filter(t => t.column == column).sort((a, b) => a.row - b.row);
	}

	getRowAt(row: number): T[] {
		return this.filter(t => t.row == row).sort((a, b) => a.column - b.column);
	}

	insertRowAt(rowIndex: number, row: T[]) {
		for (let r = this.rowMax + 1; r > rowIndex; r--) {
			const rowToMove = this.getRowAt(r - 1);
			for (let c = 0; c < this.columnMax + 1; c++) {
				this.set(c, r, rowToMove[c]);
			}
		}

		for (let c = 0; c < this.columnMax; c++) {
			this.set(c, row[c].row, row[c]);
		}
	}

	insertColumnAt(columnIndex: number, column: T[]) {
		for (let c = this.columnMax + 1; c > columnIndex; c--) {
			const columnToMove = this.getColumnAt(c - 1);
			for (let r = 0; r < this.rowMax + 1; r++) {
				this.set(c, r, columnToMove[r]);
			}
		}

		for (let r = 0; r < this.rowMax; r++) {
			this.set(column[r].column, r, column[r]);
		}
	}

	getItemAt(column: number, row: number): T {
		const item = this.items[this.key(column, row)];
		if (item != null) {
			item.row = row;
			item.column = column;

			return item;
		}

		if (
			column <= this.columnMax &&
			column >= this.columnMin &&
			row <= this.rowMax &&
			row >= this.rowMin
		) {
			const newItem = {
				column,
				row,
			} as T;

			this.set(column, row, newItem);
			return newItem;
		}

		return null;
	}

	set(column: number, row: number, value: T) {
		this.items[this.key(column, row)] = value;

		this.rowMax = row > this.rowMax ? row : this.rowMax;
		this.rowMin = row < this.rowMin ? row : this.rowMin;
		this.rows = this.rowMax - this.rowMin + 1;

		this.columnMax = column > this.columnMax ? column : this.columnMax;
		this.columnMin = column < this.columnMin ? column : this.columnMin;
		this.columns = this.columnMax - this.columnMin + 1;
	}

	find(func: (arg: T) => boolean): T {
		for (let row = this.rowMin; row < this.rowMax + 1; row++) {
			for (let column = this.columnMin; column < this.columnMax + 1; column++) {
				const item = this.getItemAt(column, row);
				if (func(item)) {
					return item;
				}
			}
		}
	}

	filter(func: (arg: T) => boolean): T[] {
		const result: T[] = [];
		for (let row = this.rowMin; row < this.rowMax + 1; row++) {
			for (let column = this.columnMin; column < this.columnMax + 1; column++) {
				const item = this.getItemAt(column, row);
				if (func(item)) {
					result.push(item);
				}
			}
		}

		return result;
	}

	fillArea(currentNode: T, nodeCallback: (arg: T) => boolean): number {
		if (currentNode == null) {
			return 0;
		}

		if (!nodeCallback(currentNode)) {
			return 0;
		}

		return this.fillArea(this.getItemAt(currentNode.column, currentNode.row - 1), nodeCallback)
			+ this.fillArea(this.getItemAt(currentNode.column, currentNode.row + 1), nodeCallback)
			+ this.fillArea(this.getItemAt(currentNode.column - 1, currentNode.row), nodeCallback)
			+ this.fillArea(this.getItemAt(currentNode.column + 1, currentNode.row), nodeCallback);
	}

	getAdjacentItems(column: number, row: number): T[] {
		return [
			this.getItemAt(column - 1, row - 1),
			this.getItemAt(column, row - 1),
			this.getItemAt(column + 1, row - 1),
			this.getItemAt(column - 1, row),
			this.getItemAt(column + 1, row),
			this.getItemAt(column - 1, row + 1),
			this.getItemAt(column, row + 1),
			this.getItemAt(column + 1, row + 1),
		].filter(item => item != null);
	}

	print(func: (arg: T) => string) {
		const padding = this.rowMax.toString().length;
		for (let r = this.rowMin; r < this.rowMax + 1; r++) {
			const row = this.getRowAt(r);
			console.log(`${r.toString().padStart(padding, "0")}`, row.map(i => func(i)).join(""));
		}

		const cpadding = this.columnMax.toString().length;
		const columnStrings: string[] = [];
		for (let c = this.columnMin; c < this.columnMax + 1; c++) {
			columnStrings.push(c.toString().padEnd(cpadding, "."));
		}

		for (let c = 0; c < this.columnMax.toString().length; c++) {
			console.log(`${"".padEnd(padding)} ${columnStrings.map(s => s[c]).join("")}`);
		}
	}
}
