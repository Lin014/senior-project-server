require('dotenv').config()
const port = process.env.PORT
const mangodb = process.env.MONGODB

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const HackmdModel = require("./models/Hackmd")
const { Query } = require('mongoose')
const Hackmd = require('./models/Hackmd')

app.use(express.json())
app.use(cors())

mongoose.connect(mangodb, {
    useNewUrlParser: true,
})

app.post('/add', async (req, res) => {

    const title = req.body.title
    const author = req.body.author
    const url = req.body.url

    const hackmd = new HackmdModel({ title: title, author: author, url: url })
    try {
        await hackmd.save()
        res.send("insert data")
    } catch (err) {
        console.log(err)
    }
})

app.get("/get", async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server running on ${port} ...`)
})