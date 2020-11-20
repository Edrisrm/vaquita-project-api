const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
var mongoosePaginate = require("mongoose-paginate-v2");

const InventorySchema = mongoose.Schema({
  breed: {
    type: String,
    required: true,
  },
  animal_number: Number,
  weight: {
    type: Number,
    required: true,
  },
  age_in_months: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    default: "en_finca",
  },

  apart: { type: mongoose.Schema.ObjectId, ref: 'Apart' },

  date: { type: Date, default: Date.now },
});

InventorySchema.plugin(AutoIncrement, {
  id: "animal_counter",
  inc_field: "animal_number",
  disable_hooks: false,
});

InventorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Inventory", InventorySchema);
