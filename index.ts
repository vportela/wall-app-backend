import express, { Request , Response } from "express";
import cors from "cors";
import { users, wallPosts } from "./wallDataBase";
import db from "./databaseConnection";

const app = express()
app.use( express.json() ) //this is parsing the request body into json

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
    user: SafeUser, 
}

export type User = { 
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
    isLoggedIn: boolean
}

type SafeUser = { 
    id: string,
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


//make a post call to log the user in, use .find to parse through array of users
//and match the user to a user in the array.
//if that is successful, response.send that it was successful 
//take user to homepage
//if unsuccessful, err "cannot find username or password"

app.use(cors({
    origin: "http://localhost:3000"
}))

app.get("/", (request: Request, response: Response) => { 
    console.log("console.log, hello from the home directory")
    const user = { 
        firstName: "tom",
        lastName: "grdkfh",
        email: "tom@gmail.com"
    }
    response.send(user)
})

// if the user is undefined, dont let them post.
//so if the data comes to the backend, and the user cannot be verified then don't let the
//rest of the code run/ or return an error message.


app.post("/posts", (request: Request<WallPostRequest>, response: Response<WallPostDto | string>) => { 
    // console.log("hello from the .post directory with request", request.body)

    const user = users.find(user => user.id === request.body.userId)
    // TODO: you have to get the user by going through the database the way you did for
    // registration (where its all in caps and stuff)
    // console.log("user", user)
    if(user === undefined || user?.isLoggedIn === false) { 
        response.status(401)
        return response.send("please log in")
    }

    const lastPostInArray = wallPosts[wallPosts.length - 1]
    const lastPostId = lastPostInArray.id 
    const numberId = Number(lastPostId)
    const newPost: WallPost = { 
        id:(numberId + 1).toString(),
        text: request.body.text,
        userId: user.id,
    }

    const newPostDto: WallPostDto = { 
        id: newPost.id,
        text: newPost.text,
        user: user
    }
    

    
    db.all(
        `
            INSERT INTO wall_post (id, text, user_id)
            VALUES (?,?,?)
        `,
        [newPost.id, newPost.text, newPost.userId],
        (error, rows) => { 
            if(error) { 
                console.log("there was an error inserting a wall post", error)
                return 
            } else { 
                rows.forEach(row => { 
                    console.log("row", row)
                    console.log("row.text", row.text)
                })
                console.log("rows", rows)
            }
        }
    ) //api MUST have a return (this is not a return, it just updates array)
    console.log("request.body", request.body )
    response.send(newPostDto)  //this is the actual return. 

})

app.get("/posts", (request: Request, response: Response<WallPostDto[]>) => { 
    console.log("fetching posts")
    // console.log("newMessageArray", newMessageArray)    


    const wallPostDtos: WallPostDto[] = wallPosts.map(wallPost => { 
        const user = users.find(user => user.id === wallPost.userId)!
        const safeUser: SafeUser = { 
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email
        }
        return {
            id: wallPost.id,
            text: wallPost.text,
            user: safeUser
        }
    })
 
    response.send(wallPostDtos)
})


//-----------Registration--------

app.post(
    "/registration", 
    (request: Request<UserRequestBody>, response: Response<void>) => { 
    console.log("hello from the registration directory with request body", 
    request.body)

    const lastUserInArray = users[users.length - 1]
    // TODO: we are no longer getting users from the array, they come out of the database. 
    const lastUserId = lastUserInArray.id 
    const numberId = Number(lastUserId) //Number casts lastUserId into a number, it is originally a string.

    const newUser: User = { 
        id: (numberId + 1).toString(), //now the id is a number, you add 1 to it and then turn it 
        //back into a string because that is the correct datatype.
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        userName: request.body.userName,
        email: request.body.email,
        password: request.body.password,
        isLoggedIn: false
    }
    db.run(
        `
            INSERT INTO user (id, first_name, last_name, user_name, email, password, is_logged_in)
            VALUES (?,?,?,?,?,?,?)
        `,
        [newUser.id, newUser.firstName, newUser.lastName, newUser.userName, newUser.email, newUser.password,
        newUser.isLoggedIn],
        (error) => {
            console.log("there was an error inserting a user into the user table", error)
        }
    )
    console.log("Users after registrationg", users)
    response.send()
})

app.get("/users", (request: Request, response: Response<User[]>) => { 
    console.log("fetching all existing users")

    response.send(users)

})


//-------------Login----------

app.post("/login", (request: Request<Login>, response: Response<SafeUser | string>) => { 
    console.log("hello from the .login directory with request", request.body)
    // console.log("this is the response", response)
    db.get(
        `SELECT * FROM user WHERE user_name = ? AND password = ?`,
        [request.body.userName, request.body.password],
        (error, row) => { 
            if (error) { 
                response.status(400)
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
            
               return response.send(safeUser)
            }
        }
    )
    
}) 

//---------------LogOut--------

app.post("/logout", (request: Request, response: Response<string>) => { 
    console.log("hello from logout directory with request", request.body)
    const userMatched = users.find((user) => 
        user.id === request.body.id
    ) 
    if (userMatched !== undefined) { 
        const index = users.findIndex(user => user.id === userMatched.id) 
        userMatched.isLoggedIn = false
        users.splice(index, 0, userMatched)
        return response.send()
    } else { 
        response.status(404)
        return response.send("Couldn't find user to log out")
    }
    
})




//starting a server on port 5000
app.listen(5000, () => { 
    console.log(`succesfully running backend on port 5000!!`)
})


//work on registration
//when user inputs their information, it will be posted to the back end
//where the info gets pushed into an array of users, and the api
//returns void 
//on success response, redirect to login page, and then there can be a new user success message
//if unsuccessful, it will stay on the page with an error message
//usehistory/uselocation from react router

// work on login
//when user inputs their info, it will be 


//take in password on registration, pw should not be readable to user

//,mini stretch goal, if successful, show success message that takes you to login page
//on login page can say "user successfully created, please login!" and then let ppl login


