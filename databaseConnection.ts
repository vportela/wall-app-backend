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
    insertInitialData();
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
                password text
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

const insertInitialData = () => { 
    console.log("inserting initial data!")

    db.exec(
        `
            INSERT INTO user (id, first_name, last_name, user_name, email, password)
            VALUES (1, 'victo', 'porto', 'vicport', 'vicport@gmail.com', 'password'),
                    (2, 'nieve', 'catte', 'princess123', 'iamcat@gmail.com', 'password'),
                    (3, 'bucky', 'doge', 'dog.boy', 'bucky@gmail.com', 'password');

            INSERT INTO wall_post (id, text, user_id)
            VALUES (1, 'Im a little teapot', 1),
                    (2, 'why dont humans understand how hard it is to be a cat', 2),
                    (3, 'no one knows you are a dog on the internet', 3);
        `,
        (error) => { 
            console.log("there was an error inserting initial data", error)
        }
    )
}

export default db