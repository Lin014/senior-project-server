const mongoose = require('mongoose')

const HackmdSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

const Hackmd = mongoose.model("HackmdData", HackmdSchema)
module.exports = Hackmd