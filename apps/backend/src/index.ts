import express from "express";
import {prismaClient} from "db/client";
const app = express();

app.get("/", (req, res) => {
    res.send("Hi there!!! 👋👋👋👋");
});

app.use(express.json());

app.post("/user/create", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.json({
                "message": "username and password are mandatory fields."
            }).status(400);
        }
        const user = await prismaClient.user.create({
            data: {
                username,
                password,
            }
        });
        res.status(201).json({
            "message": "User created successfully ... ",
            "user": user
        });

    } catch (error: any) {
        res.json({
            "message": error.message
        }).status(500);
    }

});

app.get("/users", async (req, res) => {
    try {
        const users = await prismaClient.user.findMany();
        res.status(200).json({
            "message": "Users retrieved successfully ... ",
            "users": users
        });
    } catch (error: any) {
        res.json({
            "message": error.message
        }).status(500);
    }
});

app.listen(5000, () => {
    console.log(`Server is up and running on port 5000 !!`);
});