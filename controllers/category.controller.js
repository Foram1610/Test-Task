const { getAllData } = require('../middleware/getAllData');
const { Category } = require('../models/index')

//Add category and subcategory API, in single API.
exports.addCategory = async (req, res) => {
    try {
        const data = req.body
        const category = await Category.create(data);
        if (!category) {
            return res.json({ message: "Not able to add category!!" });
        }
        return res.json({ message: "Category added!!", data: category });
    } catch (error) {
        return res.json({ message: error.message });
    }
}

// Generic API for display functionality with sorting, searching, pagination and get child table data.
exports.getAllCategory = async (req, res) => {
    try {
        const option = { ...req.body };
        if (!option.hasOwnProperty("query")) {
            option["query"] = {};
        }
        const categories = await getAllData(option, Category);
        return res.json({ data: categories });
    } catch (error) {
        return res.json({ message: error.message });
    }
}

//Update category by given category id.
exports.updateCategory = async (req, res) => {
    try {
        const data = req.body
        const checkCategory = await Category.findByPk(req.params.id)
        if (!checkCategory) {
            return res.json({ message: "Not able to find this category!!" });
        }
        const updateCategory = await Category.update(data, { where: { id: req.params.id } })
        if (!updateCategory) {
            return res.json({ message: "Not able to update the category!!" });
        }
        return res.json({ message: "Category updated!!" });
    } catch (error) {
        return res.json({ message: error.message });
    }
}

//Delete category by given category id.
exports.deleteCategory = async (req, res) => {
    try {
        const checkCategory = await Category.findByPk(req.params.id)
        if (!checkCategory) {
            return res.json({ message: "Not able to find this category!!" });
        }
        const deleteCategory = await Category.destroy({ where: { id: req.params.id } })
        if (!deleteCategory) {
            return res.json({ message: "Not able to delete the category!!" });
        }
        return res.json({ message: "Category deleted!!" });
    } catch (error) {
        return res.json({ message: error.message });
    }
}