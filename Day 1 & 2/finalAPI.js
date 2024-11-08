const express = require("express");
const app = express();
const short = require('short-uuid');

const fs = require("fs");
const strContent = fs.readFileSync("./dev-data.json", "utf-8");

const userDataStore = JSON.parse(strContent);



app.get("/api/user", function (req, res) {
    try {
        console.log("I am from get method");
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

})

app.get("/api/user/:userId/", function (req, res) {
    try {
        const userDetails = req.params.userId;
        const user = getUserById(userDetails)
        if (user == "User Not Found"){
            throw new Error(`User with ${userDetails} not found`)
        }
        res.status(200).json({
            status: "success",
            message: user
        })
    }catch(error){
       res.status(404).json({
        status: "failure",
        message: error.message
       })
    }
})

function getUserById(id) {
    const user = userDataStore.find(user => {
        return user.id == id;
    })
    if (user === undefined) {
        return "User Not Found"
    }
    return user

}

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
    }
})




app.post("/api/user", function (req, res) {
    console.log("I am from post method");
    const userDetails = req.body;
    const id = short.generate();
    userDetails.id = id;
    userDataStore.push(userDetails);

    const strUserStore = JSON.stringify(userDataStore);
    fs.writeFileSync("./dev-data.json", strUserStore);

    res.status(200).json({
        status: "success",
        message: "got response form post method"
    })

})




app.use(function (req, res) {
    res.status(400).json({
        status: "Failure",
        message: "404 Page Not Fond"
    })
})

const port = process.env.PORT || 3000;

app.listen(port, function (req, res) {
    console.log(`server is running at ${port}`)
})