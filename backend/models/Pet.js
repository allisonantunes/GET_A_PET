const mongoose = require('../db/conn')
const {Schema} = mongoose

const Pet = mongoose.model(
    'Pet',
    new Schema({
        name: {
            type: String,
            required: true
            },
        age: {  // idade
            type: Number,
            required: true
        },
        weight: {  // peso
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        images: {  // varias imagens colocar em array
            type: Array,
            required: true
        },
        available: { // se ta true ou false
            type: Boolean
        },
        user: Object,
        adopter: Object
    },
        { timestamps: true },
    )
)

module.exports = Pet
