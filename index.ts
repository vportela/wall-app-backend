import express, { Request , Response } from "express";
import cors from "cors";
import { users, wallPosts } from "./wallDataBase";

const app = express()
app.use( express.json() ) //this is parsing the request body into json

export type WallPost = {
    id: number,
    user: string,
    text: string
}

export type User = { 
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
    loggedIn: boolean
}

type SafeUser = { 
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    loggedIn: boolean
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

app.post(
    "/registration", 
    (request: Request<UserRequestBody>, response: Response<void>) => { 
    console.log("hello from the registration directory with request body", 
    request.body)

    const lastUserInArray = users[users.length - 1]
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
        loggedIn: false
    }
    users.push(newUser)
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
    const userMatched = users.find((user) => 
        user.userName === request.body.userName
        && user.password === request.body.password
    ) 
    console.log("userMatched", userMatched)
    if (userMatched !== undefined) { 
        const safeUser: SafeUser = { 
            id: userMatched.id,
            firstName: userMatched.firstName,
            lastName: userMatched.lastName,
            userName: userMatched.userName,
            email: userMatched.email,
            loggedIn: true
        }

       return response.send(safeUser)
    } else { 
        response.status(400)
        return response.send("Cannot find that username or password, please try again.")
    }
    //api MUST have a return (this is not a return, it just updates array)
    // console.log("request.body", request.body )
    // response.send(request.body)  //this is the actual return. 
    
}) // authentication time babey
//if this is successful, set a boolean on the user object to true
//on load (useEffect), if this is true, let users post, if the boolean is 
//false tell them to login. 





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


