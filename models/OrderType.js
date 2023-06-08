const mongoose = require('mongoose')

const OrderTypeSchema = new mongoose.Schema({
    type_name: {
        type: String,
        required: true
    }
})

const OrderType = mongoose.model("order_type", OrderTypeSchema)
module.exports = OrderType