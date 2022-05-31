import express, { Request , Response } from "express";
import cors from "cors";

const app = express()
// app.use( express.json() )

type WallPost = {
    id: number,
    user: string,
    text: string,
}

const newMessageArray: WallPost[] = [
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

app.post("/posts", (request: Request<WallPost>, response: Response<WallPost>) => { 
    console.log("hello from the .post directory with request body", request.body)
  //console.logs for backend show up in terminal, not browser
    // const id = request.body.id;
    // const user = request.body.user;
    // const text = request.body.text;
    // console.log("id", id)
    // console.log("user", user)
    // console.log("text", text)
    newMessageArray.push(request.body) //api MUST have a return (this is not a return, it just updates array)
    response.send(request.body)  //this is the actual return. 

})

app.get("/posts", (request: Request, response: Response<WallPost[]>) => { 
    console.log("fetching posts")
    
    response.send(newMessageArray)
    // response.send("i'm a little teapot")
   
})

//




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