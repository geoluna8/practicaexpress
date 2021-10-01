//importamos las dependencia mongoose
const { Schema, model } = require("mongoose");

// Segenera el esquema base
const SCHEMA = new Schema({
    name: { type: String, require: true },
    lastName: String,
    age: Number,
    random: Number,
});

// exportamon el schema generado
exports.agenda = model("agenda", SCHEMA);