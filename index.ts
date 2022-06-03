import express, { Request , Response } from "express";
import cors from "cors";

const app = express()
app.use( express.json() ) //this is parsing the request body into json

type WallPost = {
    id: number,
    user: string,
    text: string
}

type User = { 
    id: number,
    firstName: string,
    lastName: string,
    userName: string,
    email: string
}

 type Login = { 
    userName: string,
    password: string
 }

const wallPosts: WallPost[] = [
    { 
        id: 1,
        user: "newUser",
        text: "this is text"
    },
    { 
        id: 2,
        user: "newUser2",
        text: "testing new text"
    },    
]

const users: User[] = [
    { 
        id: 1,
        firstName: "victo",
        lastName: "porto",
        userName: "vicport",
        email: "vicport@gmail.com"
    },

]
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

app.post("/login", (request: Request<Login>, response: Response<Login>) => { 
    console.log("hello from the .login directory with request", request.body)
 

    users.find(request.body) //api MUST have a return (this is not a return, it just updates array)
    // console.log("request.body", request.body )
    response.send(request.body)  //this is the actual return. 

})

app.post("/posts", (request: Request<WallPost>, response: Response<WallPost>) => { 
    console.log("hello from the .post directory with request", request.body)
  //console.logs for backend show up in terminal, not browser
    // const id = request.body.id;
    // const user = request.body.user;
    // const text = request.body.text;
    // console.log("id", id)
    // console.log("user", user)
    // console.log("text", text)
    wallPosts.push(request.body) //api MUST have a return (this is not a return, it just updates array)
    console.log("request.body", request.body )
    response.send(request.body)  //this is the actual return. 

})

app.get("/posts", (request: Request, response: Response<WallPost[]>) => { 
    console.log("fetching posts")
    // console.log("newMessageArray", newMessageArray)    
    response.send(wallPosts)
})

//-----------Registration--------

app.post("/registration", (request: Request<User>, response: Response<User>) => { 
    console.log("hello from the registration directory with request body", 
    request.body)

    users.push(request.body)
    response.send(request.body)
})

app.get("/registration", (request: Request, response: Response<User[]>) => { 
    console.log("fetching new user")

    response.send(users)

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


