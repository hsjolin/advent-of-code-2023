export interface Test {
	name: string;
	test: () => void;
}

export abstract class TestSuite {
	abstract tests: Test[];

	runTests = () => {
		if (!this.tests) {
			console.log("No tests to run :-/");
		}

		for (let i = 0; i < this.tests.length; i++) {
			try {
				this.tests[i].test();
				this.success(this.tests[i]);
			} catch (e) {
				this.failed(this.tests[i]);
				console.log(e.message);
			}
		}
	};

	assertEqual = (expected, actual) => {
		if (expected === actual) {
			return;
		}

		throw new Error(
			"assertEqual failed. Expected '" + expected + "' was '" + actual + "'"
		);
	};

	assertNull = value => {
		if (value == null) {
			return;
		}

		throw new Error("assertNull failed. Expected 'null' was '" + value + "'");
	};

	assertTrue = value => {
		if (value === true) {
			return;
		}

		throw new Error("assertTrue failed. Expected 'true' was '" + value + "'");
	};

	assertFalse = value => {
		if (value === false) {
			return;
		}

		throw new Error("assertFalse failed. Expected 'false' was '" + value + "'");
	};

	assertThrows(expression: () => void): void {
		try {
			expression();
			throw new Error("assertThrows failed. Did not throw an exception.");
		} catch (e) {}
	}

	private success = function (test: Test) {
		console.log(test.name + " succeeded");
	};

	private failed = function (test: Test) {
		console.log("'" + test.name + "' failed");
	};
}
