import { User, WallPost } from "."



export const users: User[] = [
    { 
        id: "10",
        firstName: "victo",
        lastName: "porto",
        userName: "vicport",
        email: "vicport@gmail.com",
        password: "password",
        isLoggedIn: false

    },
    { 
        id: "20",
        firstName: "nieve",
        lastName: "catte",
        userName: "princess123",
        email: "iamcat@gmail.com",
        password: "password",
        isLoggedIn: false

    },
    { 
        id: "30",
        firstName: "bucky",
        lastName: "doge",
        userName: "dog.boy",
        email: "bucky@gmail.com",
        password: "password",
        isLoggedIn: false

    },
]

export const wallPosts: WallPost[] = [
    { 
        id: "1",
        text: "this is text",
        userId: "10",
    },
    { 
        id: "2",
        text: "testing new text",
        userId: "20",
    },    
    { 
        id: "3",
        text: "you can post on the wall if youre logged in",
        userId: "30",
    },    
]