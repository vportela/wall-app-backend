import express from "express";

const app = express()

app.get("/victoriaLovesCookies", (request, response) => { 
    console.log("console.log, hello from the home directory")
    response.send("hello from the home directory")
})

//starting a server on port 5000
app.listen(5000, () => { 
    console.log(`yay my server is running on port`)
})