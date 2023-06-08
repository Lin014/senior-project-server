const mongoose = require('mongoose')

const OrderItemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: false
    },
    unit_price: {
        type: Number,
        required: true
    },
    order_id: {
        type: String,
        required: true
    }
})

const OrderItems = mongoose.model("order_items", OrderItemsSchema)
module.exports = OrderItems