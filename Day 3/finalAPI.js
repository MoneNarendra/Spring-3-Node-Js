const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const { PORT, DB_USER, DB_PASSWORD } = process.env;

const app = express();



const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@backenddb.43qoh.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB`;

mongoose.connect(dbURL).then(function (connection) {
    console.log("Connection success");
}).catch(err => console.log(err));

const userSchemaRules = {
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true, minlength: 8 },
    confirmPassword: {
        type: String, required: true, minlength: 8, validate: function () {
            return this.password == this.confirmPassword
        }
    },
    createAt: { type: Date, default: Date.now() }
}

const userSchema = new mongoose.Schema(userSchemaRules)


const UserModel = mongoose.model("UserModel", userSchema)


app.use(express.json());

app.use(function (req, res, next) {
    if (req.method == "POST") {
        const userDetails = req.body;
        const isEmpty = Object.keys(userDetails).length == 0;
        if (isEmpty) {
            res.status(404).json({
                status: "failed",
                message: "User Details are empty"
            })
        } else {
            next();
        }
    } else {
        next();
    }
})


// API's
app.get("/api/user", getAllUsers);


app.get("/api/user/:userId/", getUserById);


app.post("/api/user", createUserHanler)

// Handlers Functions

async function getAllUsers(req, res) {
    try {
        console.log("I am from get method");
        const userDataStore = await UserModel.find();
        if (userDataStore.length == 0) {
            throw new Error("No User Found")
        }
        res.status(200).json({
            status: "success",
            message: userDataStore
        })

    } catch (error) {
        res.status(404).json({
            status: "failed",
            message: error.message
        })
    }

}

async function getUserById(req, res) {
    try {
        const userDetails = req.params.userId;
        const user = await UserModel.findById(userDetails)
        if (user == "User Not Found") {
            throw new Error(`User with ${userDetails} not found`)
        }
        res.status(200).json({
            status: "success",
            message: user
        })
    } catch (error) {
        res.status(404).json({
            status: "failure",
            message: error.message
        })
    }
}

async function createUserHanler(req, res) {
    try{
        const userDeatils = req.body

        const user = await UserModel.create(userDeatils);
        res.status(200).json({
            status: "success",
            message: "added the user",
            user
        })

    }catch(err){
        res.status(500).json({
            status: "Failure",
            message: err.message
        })
    }

}

// Helper Function

function findUser(id) {
    const user = userDataStore.find(user => {
        return user.id == id;
    })
    if (user === undefined) {
        return "User Not Found"
    }
    return user

}





app.use(function (req, res) {
    res.status(404).json({
        status: "Failure",
        message: "404 Page Not Fond"
    })
})






app.listen(PORT, function (req, res) {
    console.log(`Server runnig at ${PORT}`)
})