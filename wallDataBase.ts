import { User, WallPost } from "."

export const wallPosts: WallPost[] = [
    { 
        id: "1",
        text: "this is text"
    },
    { 
        id: "2",
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
        isLoggedIn: false

    },
]