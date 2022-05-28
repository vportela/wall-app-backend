import express, { Request , Response } from "express";


const app = express()


app.get("/", (request: Request, response: Response) => { 
    console.log("console.log, hello from the home directory")
    response.send("hello from the home directory")
})

app.get("/posts", (request: Request, response: Response) => { 
    response.send("these are posts hello")
})

//starting a server on port 5000
app.listen(5000, () => { 
    console.log(`testing`)
})