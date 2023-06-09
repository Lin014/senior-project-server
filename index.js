require('dotenv').config()
const PORT = process.env.PORT || 3001

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const HackmdModel = require("./models/Hackmd")
const MenuCategories = require('./models/MenuCategories')
const MenuItems = require('./models/MenuItems')
const Orders = require('./models/Order')
const OrderItems = require('./models/OrderItems')
const OrderType = require('./models/OrderType')

app.use(express.json())
app.use(cors())

mongoose.set('strictQuery', false)

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.log({ "err": err })
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
        console.log({ "err": err })
    }
})

app.get('/', async (req, res) => {
    try {
        const query = await HackmdModel.find({}).exec()
        res.send(query)
    } catch (err) {
        res.send({ "err": err })
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
        res.send({ "err": err })
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
        res.send({ "err": err })
    }
})

app.get('/turkeyrice/menuitems/', async (req, res) => {
    try {
        const query = await MenuItems.find({}).exec()
        res.send(query)
    } catch (err) {
        res.send({ "err": err })
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
        console.log({ "err": err })
    }
})

app.put('/turkeyrice/menuitems/update', async (req, res) => {
    const id = req.body.id
    const item_name = req.body.item_name
    const description = req.body.description
    const category_id = req.body.category_id
    const unit_price = req.body.unit_price

    try {
        await MenuItems.updateMany({ _id: id }, { item_name: item_name, description: description, unit_price: unit_price, category_id: category_id }, { new: true })
            .then((result) => {
                res.send(result)
            })
    } catch (err) {
        res.send({ "err": err })
    }
})

app.delete('/turkeyrice/menuitems/delete/:id', async (req, res) => {
    const id = req.params.id
    await MenuItems.findByIdAndDelete(id)
    res.send("delete")
})

app.get('/turkeyrice/order/todayordernumber', async (req, res) => {
    const today = new Date();
    const year = today.getFullYear(); // 获取年份
    const month = today.getMonth() + 1; // 获取月份，需要加 1，因为月份从 0 开始计数
    const day = today.getDate(); // 获取日期
    const dateStr = year + '-' + month + '-' + day;

    try {
        const count = await Orders.countDocuments({ order_date: dateStr });
        res.send({ 'count': count })
    } catch (err) {
        res.send({ "err": err })
    }
})

app.get('/turkeyrice/ordertype', async (req, res) => {
    try {
        const query = await OrderType.find({}).exec()
        res.send(query)
    } catch (err) {
        res.send({ "err": err })
    }
})

app.get('/turkeyrice/order/', async (req, res) => {
    try {
        const query = await Orders.find({}).exec()
        res.send(query)
    } catch (err) {
        res.send({ "err": err })
    }
})

app.get('/turkeyrice/orderitem/', async (req, res) => {
    try {
        const query = await OrderItems.find({}).exec()
        res.send(query)
    } catch (err) {
        res.send({ "err": err })
    }
})

app.post('/turkeyrice/order/add', async (req, res) => {

    const today = new Date();
    const year = today.getFullYear(); // 获取年份
    const month = today.getMonth() + 1; // 获取月份，需要加 1，因为月份从 0 开始计数
    const day = today.getDate(); // 获取日期
    const dateStr = year.toString() + '-' + month.toString() + '-' + day.toString();

    const order_no = req.body.order_no
    const order_date = dateStr
    const total_price = req.body.total_price
    const payment_status = req.body.payment_status
    const order_status = req.body.order_status
    const type = req.body.type
    const items = req.body.items

    try {
        await Orders.insertMany([
            {
                order_no: order_no,
                order_date: order_date,
                total_price: total_price,
                payment_status: payment_status,
                order_status: order_status,
                type: type
            }
        ])

        const result = await Orders.find({ order_no: order_no, order_date: order_date }).exec();

        const updateItems = []
        items.forEach(element => {
            updateItems.push({
                name: element.name,
                quantity: element.quantity,
                unit_price: element.unit_price,
                order_id: result[0]._id
            })
        });
        console.log(updateItems)
        await OrderItems.insertMany(updateItems)

        res.send("insert data")
    } catch (err) {
        console.log({ "err": err })
    }
})

app.put('/turkeyrice/order/update', async (req, res) => {
    const id = req.body.id
    const payment_status = req.body.payment_status
    const order_status = req.body.order_status

    try {
        await Orders.updateMany({ _id: id }, { payment_status: payment_status, order_status: order_status }, { new: true })
            .then((result) => {
                res.send(result)
            })
    } catch (err) {
        res.send({ "err": err })
    }
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT} ...`)
    })
})
