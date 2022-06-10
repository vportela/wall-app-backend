"use strict";
exports.__esModule = true;
var process_1 = require("process");
var sqlite3 = require("sqlite3");
console.log("hello from inside database.ts");
var db = new sqlite3.Database("./wall_app.db", function (error) {
    if (error) {
        console.log(">>>>>> error: ", error);
        (0, process_1.exit)(1);
    }
    console.log("--------no errors-------");
    createTables();
});
var createTables = function () {
    console.log("creating tables");
    db.exec("\n            CREATE TABLE user (\n                id text PRIMARY KEY,\n                first_name text,\n                last_name text,\n                user_name text,\n                email text,\n                password text,\n                is_logged_in bool\n            );\n            CREATE TABLE wall_post (\n                id text PRIMARY KEY,\n                text text,\n                user_id text REFERENCES user (id)\n            );\n        ", function (error) {
        console.log("error making tables", error);
    });
};
exports["default"] = db;
