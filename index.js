require('dotenv').config()
const PORT = process.env.PORT || 3001

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const HackmdModel = require("./models/Hackmd")
const MenuCategories = require('./models/MenuCategories')
const MenuItems = require('./models/MenuItems')

app.use(express.json())
app.use(cors())

mongoose.set('strictQuery', false)

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

app.get('/', async (req, res) => {
    try {
        const query = await HackmdModel.find({}).exec()
        res.send(query)
    } catch (err) {
        res.send(err)
    }
})

app.put('/update', async (req, res) => {
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

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    await HackmdModel.findByIdAndDelete(id)
    res.send("delete")
})

app.get('/turkeyrice/menucategories/', async (req, res) => {
    try {
        const query = await MenuCategories.find({}).exec()
        res.send(query)
    } catch (err) {
        res.send(err)
    }
})

app.get('/turkeyrice/menuitems/', async (req, res) => {
    try {
        const query = await MenuItems.find({}).exec()
        res.send(query)
    } catch (err) {
        res.send(err)
    }
})

app.post('/turkeyrice/menuitems/add', async (req, res) => {

    const item_name = req.body.item_name
    const description = req.body.description
    const unit_price = req.body.unit_price
    const category_id = req.body.category_id

    try {
        await MenuItems.insertMany([
            {
                item_name: item_name,
                description: description,
                unit_price: unit_price,
                category_id: category_id
            }
        ])
        res.send("insert data")
    } catch (err) {
        console.log(err)
    }
})

app.put('/turkeyrice/menuitems/update', async (req, res) => {
    const id = req.body.id
    const item_name = req.body.item_name
    const description = req.body.description
    const category_id = req.body.category_id
    const unit_price = req.body.unit_price
    
    try {
        await MenuItems.updateMany({_id: id}, { item_name: item_name, description: description, unit_price: unit_price, category_id: category_id }, { new: true })
            .then((result) => {
                res.send(result)
            })
    } catch (err) {
        res.send(err)
    }
})

app.delete('/turkeyrice/menuitems/delete/:id', async (req, res) => {
    const id = req.params.id
    await MenuItems.findByIdAndDelete(id)
    res.send("delete")
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT} ...`)
    })
})
