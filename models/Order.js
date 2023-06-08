const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    order_no: {
        type: Number,
        required: true
    },
    order_date: {
        type: String,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    payment_status: {
        type: String,
        required: true
    },
    order_status: {
        type: String,
        requried: true
    },
    type: {
        type: String,
        required: true
    }
})

const Orders = mongoose.model("orders", OrderSchema)
module.exports = Orders