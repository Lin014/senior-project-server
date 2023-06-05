const mongoose = require('mongoose')

const MenuItemsSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    unit_price: {
        type: Number,
        required: true
    },
    category_id: {
        type: String,
        required: true
    }
})

const MenuItems = mongoose.model("menu_items", MenuItemsSchema)
module.exports = MenuItems