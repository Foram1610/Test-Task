const express = require('express');
const route = express.Router();
const category = require('./category')

route.use("/category", category)

module.exports = route;