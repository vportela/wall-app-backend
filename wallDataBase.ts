import { User, WallPost } from "."

export const wallPosts: WallPost[] = [
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

export const users: User[] = [
    { 
        id: "1",
        firstName: "victo",
        lastName: "porto",
        userName: "vicport",
        email: "vicport@gmail.com",
        password: "password",
        loggedIn: false
    },
]