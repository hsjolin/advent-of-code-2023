export class Interval {
	constructor(start: number, end: number) {
		if (start > end) {
			throw new Error("Start cannot be larger than end in an interval");
		}

		this.start = start;
		this.end = end;
	}

	start: number;
	end: number;

	size(): number {
		return this.end - this.start + 1;
	}

	includes(interval: Interval): boolean {
		return this.start <= interval.start && this.end >= interval.end;
	}

	intersects(interval: Interval): boolean {
		return this.includes(interval) || (this.end >= interval.start && this.end <= interval.end) ||
			(this.start <= interval.end && this.start >= interval.start);
	}

	join(interval: Interval): void {
		if (this.includes(interval)) {
			return;
		}

		if (!this.intersects(interval)) {
			throw Error("Cannot join intervals that doesn't intersects");
		}

		this.start = Math.min(this.start, interval.start);
		this.end = Math.max(this.end, interval.end);
	}
}
