const { Category } = require("../models");

const includeFields = [
    {
        field: "Category",
        as : "Subcategories",
        model: Category,
    },
];

module.exports = { includeFields };