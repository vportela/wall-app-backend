import express, { Request , Response } from "express";
import cors from "cors";

const app = express()

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

app.get("/posts", (request: Request, response: Response) => { 
    console.log("fetching posts")
    const newMessageArray = [
        { 
        id: 1,
        user: "newUser",
        text: "this is text"
        }
    ]
    response.send(newMessageArray)
   
})



//starting a server on port 5000
app.listen(5000, () => { 
    console.log(`succesfully running backend on port 5000!!`)
})