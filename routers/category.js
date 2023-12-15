const express = require('express');
const route = express.Router();
const category = require('../controllers/category.controller')
const { categoryCheck, valResult } = require("../middleware/validation")

route.post("/add", categoryCheck, valResult, category.addCategory)
route.post("/getAll", category.getAllCategory)
route.put("/update/:id", category.updateCategory)
route.delete("/delete/:id", category.deleteCategory)

module.exports = route;