const mongoose = require('mongoose')

const MenuCategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
})

const MenuCategories = mongoose.model("menu_categories", MenuCategoriesSchema)
module.exports = MenuCategories