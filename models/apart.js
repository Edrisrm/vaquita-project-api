const { Schema, model} = require('mongoose');

const ApartSchema = Schema({
    square_meter: {
        type: Number,
        required: true,
    },
    apart_number: {
        type: Number,
        required: true,
    }
});

module.exports = model('Apart', ApartSchema );