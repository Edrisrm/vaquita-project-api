const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
var mongoosePaginate = require('mongoose-paginate-v2');

const current_inventories_schema = mongoose.Schema({
    breed: {
        type: String,
        required: true,
    },
    animal_number: Number,
    weight: {
        type: Number,
        required: true,
    },
    age_in_months:{
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    state: {
        type: String,
        default: 'Finca',
    },
    division: { // potrero
        type: String,
        
    },
    date: { type: Date, default: Date.now },
}); 

current_inventories_schema.plugin(AutoIncrement, {id:'animal_counter', inc_field: 'animal_number', disable_hooks: false});


current_inventories_schema.plugin(mongoosePaginate);

module.exports = mongoose.model('current_inventories', current_inventories_schema);