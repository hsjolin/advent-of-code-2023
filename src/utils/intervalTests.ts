import { Interval } from "./interval";
import { Test, TestSuite } from "./testUtils";

class IntervalTests extends TestSuite {
	tests: Test[] = [
		{
			name: "intersect tests",
			test: () => {
				const objectUnderTest = new Interval(1, 5);
				const intersecting = new Interval(5, 6);
				const includes = new Interval(1, 2);
				const notIntersecting = new Interval(6, 7);

				this.assertTrue(objectUnderTest.intersects(intersecting));
				this.assertTrue(objectUnderTest.intersects(includes));
				this.assertFalse(objectUnderTest.intersects(notIntersecting));
			},
		},
		{
			name: "intersect tests negative intervals",
			test: () => {
				const objectUnderTest = new Interval(-1, 5);
				const intersecting = new Interval(-5, 1);
				const includes = new Interval(-1, 2);
				const notIntersecting = new Interval(-7, -6);

				this.assertTrue(objectUnderTest.intersects(intersecting));
				this.assertTrue(objectUnderTest.intersects(includes));
				this.assertFalse(objectUnderTest.intersects(notIntersecting));
			},
		},
		{
			name: "intersect tests large numbers",
			test: () => {
				const objectUnderTest = new Interval(-774791, 4686938);
				const interval = new Interval(1724671, 2202269);

                this.assertTrue(objectUnderTest.intersects(interval));
                this.assertTrue(interval.intersects(objectUnderTest));
                this.assertTrue(objectUnderTest.includes(interval));
			},
		},
		{
			name: "join tests",
			test: () => {
				const objectUnderTest = new Interval(1, 5);
				const intersecting = new Interval(5, 6);
				const includes = new Interval(2, 4);
				const notIntersecting = new Interval(6, 7);
				const included = new Interval(0, 6);

				objectUnderTest.join(includes);
				this.assertEqual(1, objectUnderTest.start);
				this.assertEqual(5, objectUnderTest.end);
				this.assertEqual(5, objectUnderTest.size());

				objectUnderTest.join(intersecting);
				this.assertEqual(1, objectUnderTest.start);
				this.assertEqual(6, objectUnderTest.end);
				this.assertEqual(6, objectUnderTest.size());

				objectUnderTest.join(included);
				this.assertEqual(0, objectUnderTest.start);
				this.assertEqual(6, objectUnderTest.end);
				this.assertEqual(7, objectUnderTest.size());

				this.assertThrows(() => objectUnderTest.join(notIntersecting));
			},
		},
		{
			name: "join tests large numbers",
			test: () => {
				const objectUnderTest = new Interval(-774791, 4686938);
				const interval = new Interval(1724671, 2202269);

				objectUnderTest.join(interval);
				this.assertEqual(-774791, objectUnderTest.start);
				this.assertEqual(4686938, objectUnderTest.end);
				this.assertEqual(5461730, objectUnderTest.size());
			},
		},
		{
			name: "join tests negative intervals",
			test: () => {
				const objectUnderTest = new Interval(-1, 5);
				const intersecting = new Interval(-5, 1);
				const includes = new Interval(-1, 2);
				const notIntersecting = new Interval(-7, -6);

				objectUnderTest.join(includes);
				this.assertEqual(-1, objectUnderTest.start);
				this.assertEqual(5, objectUnderTest.end);
				this.assertEqual(7, objectUnderTest.size());

				objectUnderTest.join(intersecting);
				this.assertEqual(-5, objectUnderTest.start);
				this.assertEqual(5, objectUnderTest.end);
				this.assertEqual(11, objectUnderTest.size());

				this.assertThrows(() => objectUnderTest.join(notIntersecting));
			},
		},
	];
}

const tests = new IntervalTests();
tests.runTests();
