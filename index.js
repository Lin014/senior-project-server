require('dotenv').config()
const PORT = process.env.PORT || 3001

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const HackmdModel = require("./models/Hackmd")
const { Query } = require('mongoose')

app.use(express.json())
app.use(cors())

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

app.post('/add', async (req, res) => {

    const title = req.body.title
    const author = req.body.author
    const url = req.body.url

    // const hackmd = new HackmdModel({ title: title, author: author, url: url })
    try {
        await HackmdModel.insertMany([
            {
                title: title, author: author, url: url
            }
        ])
        res.send("insert data")
    } catch (err) {
        console.log(err)
    }
})

app.get("/", async (req, res) => {
    try {
        const query = await HackmdModel.find({}).exec()
        res.send(query)
    } catch (err) {
        res.send(err)
    }
})

app.put("/update", async (req, res) => {
    const id = req.body.id
    const newTitle = req.body.newTitle
    try {
        console.log(newTitle)
        await HackmdModel.findByIdAndUpdate(id, { title: newTitle }, { new: true })
            .then((result) => {
                console.log(result)
                res.send(result)
            })
    } catch (err) {
        res.send(err)
    }
})

app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id
    await HackmdModel.findByIdAndDelete(id)
    res.send("delete")
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT} ...`)
    })
})
