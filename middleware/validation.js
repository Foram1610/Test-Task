const { check, validationResult } = require('express-validator')

exports.categoryCheck = [
    check('name').trim().not().isEmpty().withMessage('Name of category is required!!!'),
    check('description').trim().not().isEmpty().withMessage('Descripton is required!!!')
]

exports.valResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;
        return res.status(422).json({ success: false, error: error })
    }
    next();
};