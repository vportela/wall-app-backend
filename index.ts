import express, { Request, Response } from "express";
import cors from "cors";
import db from "./databaseConnection";
import cookieParser from "cookie-parser";

const app = express()
app.use(express.json()) //this is parsing the request body into json
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

export type WallPost = {
    id: string,
    text: string,
    userId: string,
}

type WallPostRequest = {
    text: string,
    userId: string
}

type WallPostDto = {
    id: string,
    text: string,
    userId: number,
    userName: string,
}

export type User = {
    id: number,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
}

type UserTable = { 
    id: number, 
    first_name: string,
    last_name: string,
    user_name: string, 
    email: string
    password: string,
}

type SafeUser = {
    id: number,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
}

type Login = {
    userName: string,
    password: string
}
type UserRequestBody = {
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
}
type Session = { 
    id: number,
    userId: number
}

const getUserFromSession = (request: Request, callback: (error: any, safeUser: SafeUser | undefined, sessionId: Number | undefined) => void) => {
    console.log("checking session");
    console.log('Cookies: ', request.cookies);
    let sessionId = request.cookies['sessionId'];
    if (sessionId) {
        sessionId = Number(sessionId);
        db.get(
            `SELECT 
                user.id, user.first_name, user.last_name, user.user_name, user.email 
            FROM user join session on session.user_id = user.id WHERE session.id = ?`,
            [sessionId],
            (error, row) => {
                if (error) {
                    callback(error, undefined, undefined)
                } else {
                    console.log("row", row)

                    const safeUser: SafeUser = {
                        id: row.id,
                        firstName: row.first_name,
                        lastName: row.last_name,
                        userName: row.user_name,
                        email: row.email,
                    }
                    callback(null, safeUser, sessionId)
                }
            }
        )
    } else {
        callback("No Session ID", undefined, undefined)
    }
}

app.post("/registration",(request: Request<UserRequestBody>, response: Response<void | string>) => {
    console.log("hello from the registration directory with request body",request.body)
    const user: UserRequestBody = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        userName: request.body.userName,
        email: request.body.email,
        password: request.body.password,
    }
   
    db.run(
        `
            INSERT INTO user (first_name, last_name, user_name, email, password)
            VALUES (?,?,?,?,?)
        `,
        [user.firstName, user.lastName, user.userName, user.email, user.password],
        (error) => {
            if (error) {
                console.log("there was an error inserting a user into the user table", error)
            }
        }
    )
    response.send()
})

app.post("/login", (request: Request<Login>, response: Response<SafeUser | string>) => {
    console.log("hello from the .login directory with request", request.body)
    db.get(
        `SELECT * FROM user WHERE user_name = ? AND password = ?`,
        [request.body.userName, request.body.password],
        (error, row) => {
            if (error) {
                response.status(404)
                return response.send("Cannot find that username or password, please try again.")
            } else {
                console.log("row", row)

                const safeUser: SafeUser = {
                    id: row.id,
                    firstName: row.first_name,
                    lastName: row.last_name,
                    userName: row.user_name,
                    email: row.email,
                }

                db.run(
                    `INSERT INTO session (user_id) VALUES (?)`,
                    [row.id],
                    function (error) {
                        if (error) {
                            console.log("there was an error inserting a user into the user table", error)
                            response.status(500)
                            return response.send("Cannot insert session.")
                        }

                        response.cookie("sessionId", this.lastID.toString())
                        return response.send(safeUser)
                    }
                )
            }
        }
    )

})

app.get("/authenticate", (request: Request, response: Response) => { 
    console.log("request.session", request.cookies.sessionId)
    if(request.cookies.sessionId) { 
        db.get(
            `
                SELECT u.* FROM user u
                JOIN session s ON s.user_id = u.id
                WHERE s.id = ?
            `,
            [request.cookies.sessionId],
            (error, row: UserTable) => { 
                if(error) { 
                    console.log("there was an error getting a user by session Id", error)
                }
                console.log("row", row)
                const safeUser: SafeUser = { 
                    id: row.id,
                    firstName: row.first_name,
                    lastName: row.last_name,
                    userName: row.user_name,
                    email: row.email,
                }
                return response.send(safeUser)
            }
        )
    } 
})

app.post("/logout", (request: Request, response: Response<string>) => {
    console.log("hello from logout directory with request", request.body)
    getUserFromSession(request, (error, user, sessionId) => { 
        if (error) {
            console.log("error logout:", error)
            response.status(403)
            return response.send("User not logged in")
        }

        console.log("logout user")
        db.run('DELETE from session where id = ?', [sessionId]);
        response.clearCookie('sessionId');
        return response.send();
    });
})

app.get("/session", (request: Request, response: Response) => {
    db.all( `SELECT * FROM session;`, [], (error, rows) => { 
        if(error) {
            console.log("error", error)
        }
        console.log("session rows", rows)
        const sessions: Session[] = rows.map(row => { 
            return {
                id: row.id,
                userId: row.user_id
            }
        }) 
        return response.send(sessions) 
    })
})

app.get("/users", (request: Request, response: Response<SafeUser[]>) => {
    console.log("fetching all existing users")
    db.all(
        `SELECT id, first_name, last_name, user_name, email FROM user`, 
        (error, rows) => {
            if (error) {
                response.status(500)
                return response.send([])
            }
            response.send(rows.map(row => {
                return {
                    id: row.id,
                    firstName: row.first_name,
                    lastName: row.last_name,
                    userName: row.user_name,
                    email: row.email,
                }
            }))
        }
    )
})

app.post("/posts", (request: Request<WallPostRequest>, response: Response<WallPostDto | string>) => {

    getUserFromSession(request, (error, user, sessionId) => { 
        if (error) {
            console.log("error logout:", error)
            response.status(403)
            return response.send("User not logged in")
        }
        if (!user) {
            console.log("missing user")
            response.status(500)
            return response.send("Cant find user")
        }
        const postText = request.body.text
        db.run(
            `
                INSERT INTO wall_post (text, user_id)
                VALUES (?,?)
            `,
            [postText, user.id],
            function (error) {
                if (error) {
                    console.log("there was an error inserting a wall post", error)
                    response.status(500)
                    return response.send("there was an error making a new post")
                } 
                console.log("request.body", request.body)
                return response.send({id: this.lastID.toString(10), text: postText, userId: user.id, userName: user.userName})
            }
        ) 
        
    });

})

app.get("/posts", (request: Request, response: Response<WallPostDto[]>) => {
    console.log("fetching posts")

    db.all(
        `SELECT wall_post.id, wall_post.user_id, wall_post.text, user.user_name FROM wall_post join user on user.id = wall_post.user_id`,
        (error, rows) => {
            if(error) { 
                response.status(500)
                console.log("something went wrong getting posts", error)
                return response.send([])
            }
            console.log("post rows", rows);
            response.send(rows.map(row => { 
                return { 
                    id: row.id,
                    text: row.text,
                    userId: row.user_id,
                    userName: row.user_name
                }
            }))
        })
})



//starting a server on port 5000
app.listen(5000, () => {
    console.log(`succesfully running backend on port 5000!!`)
})




