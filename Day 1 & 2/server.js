const express = require("express")
const app = express()


app.use(function (req, res, next){
    // res.status(404).json({
    //     status: "failure",
    //     message: "Hello Every One"
    // })
    console.log("Before", req.body)

    
    next();
})

app.use(express.json());

app.use(function (req, res, next){
    // res.status(404).json({
    //     status: "failure",
    //     message: "Hello Every One"
    // })
    console.log("After", req.body)
    next();
})




app.post("/", function (req, res) {
    console.log("I Am inside Method ")
    res.status(200).json({
        status: "success",
        message: "Hello Every One in Method"
    })
})



const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`node listen at port ${port}`);
})

