const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("DB connected Successfully");
    })
    .catch((error)=>{
        console.log("DB Connection Issue");
        console.log(error);
        process.exit(1);
    })
}