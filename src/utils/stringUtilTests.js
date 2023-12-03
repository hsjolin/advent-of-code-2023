const stringUtil = require('./stringUtil');

const assertEqual = function (expected, actual) {
    if (expected === actual) {
        return;
    }

    throw "assertEqual failed. Expected '" + expected + "' was '" + actual + "'";
};

const assertNull = function (value) {
    if (value == null) {
        return;
    }

    throw "assertNull failed. Expected 'null' was '" + value + "'";
};

const success = function (test) {
    console.log(test.name + " succeeded");
};

const failed = function (test) {
    console.log(test.name + " failed");
};

const stringUtilTest = {
    tests: [
        {
            name: "read() test",
            execute: function () {
                stringUtil.setString("Hello world");
                assertEqual("H", stringUtil.read(1));
                assertEqual("e", stringUtil.read(1));
                assertEqual("l", stringUtil.read(1));
                assertEqual("l", stringUtil.read(1));
                assertEqual("o", stringUtil.read(1));
                assertEqual(" ", stringUtil.read(1));
                assertEqual("w", stringUtil.read(1));
                assertEqual("o", stringUtil.read(1));
                assertEqual("r", stringUtil.read(1));
                assertEqual("l", stringUtil.read(1));
                assertEqual("d", stringUtil.read(1));
                assertNull(stringUtil.read(1));
                assertEqual(true, stringUtil.isEOL());
            }
        },
        {
            name: "peek() test",
            execute: function () {
                stringUtil.setString("Hello world");
                assertEqual("H", stringUtil.peek());
                assertEqual("H", stringUtil.peek());
                assertEqual(0, stringUtil.position);
            }
        },
        {
            name: "delete() test",
            execute: function () {
                stringUtil.setString("Hello world");
                stringUtil.delete(1);
                assertEqual("ello world", stringUtil.string);
                stringUtil.delete(4);
                assertEqual(" world", stringUtil.string);
                assertEqual(0, stringUtil.position);
                stringUtil.position = 2;
                stringUtil.delete(1);
                assertEqual(" wrld", stringUtil.string);
                assertEqual(2, stringUtil.position);                
            }
        },
        {
            name: "write() test",
            execute: function () {
                stringUtil.setString("Hello world");
                stringUtil.position = 5;
                stringUtil.write(" cruel");
                assertEqual("Hello cruel world", stringUtil.string);
                assertEqual(11, stringUtil.position);
            }
        },
        {
            name: "readUntil() test",
            execute: function () {
                stringUtil.setString("Hello world");
                let str = stringUtil.readUntil(c => c == " ");
                assertEqual("Hello", str);
                assertEqual(5, stringUtil.position);
            }
        },
        {
            name: "searchLeft() test",
            execute: function () {
                stringUtil.setString("Hello world");
                stringUtil.position = 5;
                let pos = stringUtil.searchLeft(c => c == 'H');
                assertEqual(0, pos);
                assertEqual(5, stringUtil.position);
                pos = stringUtil.searchLeft(c => c == 'x');
                assertEqual(-1, pos);
                assertEqual(5, stringUtil.position);
            }
        },
        {
            name: "searchRight() test",
            execute: function () {
                stringUtil.setString("Hello world");
                stringUtil.position = 5;
                let pos = stringUtil.searchRight(c => c == 'd');
                assertEqual(10, pos);
                assertEqual(5, stringUtil.position);
                pos = stringUtil.searchRight(c => c == 'x');
                assertEqual(-1, pos);
                assertEqual(5, stringUtil.position);
            }
        },
    ],
    runTests: function () {
        this.tests.forEach(test => {
            try {
                test.execute();
                success(test);
            } catch (e) { 
                console.log(e);
                failed(test);
            }
        });
    }
}

module.exports = stringUtilTest;