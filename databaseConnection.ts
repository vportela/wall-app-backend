import { exit } from "process";
import sqlite3 from "sqlite3";

console.log("hello from inside database.ts")

const db = new sqlite3.Database("./wall_app.db", (error) => { 
    if (error) { 
        console.log(">>>>>> error: ", error);
        exit(1);
    }
    console.log("--------no errors-------");
    createTables();
})

const createTables = () => { 
    console.log("creating tables")
    db.exec(
        `
            CREATE TABLE IF NOT EXISTS user (
                id integer PRIMARY KEY AUTOINCREMENT,
                first_name text,
                last_name text,
                user_name text,
                email text,
                password text,
                is_logged_in bool
            );
            CREATE TABLE IF NOT EXISTS session (
                id integer PRIMARY KEY AUTOINCREMENT,
                user_id integer REFERENCES user (id)
            );
            CREATE TABLE IF NOT EXISTS wall_post (
                id integer PRIMARY KEY AUTOINCREMENT,
                text text,
                user_id integer REFERENCES user (id)
            );
        `,
        (error) => {
            console.log("error making tables", error)
        }
    )
}

export default db