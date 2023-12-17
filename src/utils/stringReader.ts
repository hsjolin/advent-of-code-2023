export default class StringReader {
	string: string = "";
	position: number = 0;

	constructor(string: string) {
		this.string = string;
	}

	resetPosition = function () {
		this.position = 0;
	};

	isEOL = function () {
		return this.position >= this.string.length;
	};

	read = function (len: number): string {
		if (this.isEOL()) {
			return null;
		}

		const str = this.string.substring(this.position, this.position + len);
		this.position += len;
		return str;
	};

	delete = function (len: number) {
		this.string =
			this.string.substring(0, this.position) +
			this.string.substring(this.position + len);
	};

	write = function (string: string) {
		this.string =
			this.string.substring(0, this.position) +
			string +
			this.string.substring(this.position);
		this.read(string.length);
	};

	peek = function (): string {
		if (this.isEOL()) {
			return null;
		}

		return this.string[this.position];
	};

	peekLeft = function (): string {
		if (this.position <= 0) {
			return null;
		}

		return this.string[this.position - 1];
	}

	readUntil = function (charFunc: (char: string) => boolean): string {
		if (this.isEOL()) {
			return null;
		}

		let string = "";
		let char = this.peek();
		while (!charFunc(char) && !this.isEOL()) {
			this.read(1);
			string += char;
			char = this.peek();
		}

		return string;
	};

	readLeftUntil = function (charFunc: (char: string) => boolean): string {
		if (this.position <= 0) {
			return null;
		}

		let string = "";
		let char = this.peekLeft();
		while (!charFunc(char) && this.position > 0) {
			this.position--;
			string = char + string;
			char = this.peekLeft();
		}

		return string;
	};

	lookRight = function (searchString:string): boolean {
		return this.string.substring(this.position, this.position + searchString.length) == searchString;
	};

	lookLeft = function (searchString: string): boolean {
		return this.string.substring(this.position - searchString.length, this.position - searchString.length + searchString.length) == searchString;
	};

	searchLeft = function (searchFunc: (char: string) => boolean): number {
		let position = this.position;
		while (position > -1 && !searchFunc(this.string[--position])) {}

		return position;
	};

	searchRight = function (searchFunc: (char: string) => boolean): number {
		let position = this.position;
		while (
			position < this.string.length &&
			!searchFunc(this.string[++position])
		) {}

		if (position >= this.string.length) {
			return -1;
		}

		return position;
	};
}
