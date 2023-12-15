const { Op } = require("sequelize");
const { includeFields } = require("../utils/modelCheck");

async function IncludeRecursive(array) {
    try {
        let fields = [],
            as = null,
            nestedInclude = [];
        for (let i = 0; i < array.length; i++) {
            const includeObject = array[i];
            for (let j = 0; j < includeFields.length; j++) {
                const modelField = includeFields[j];
                if (modelField.field === includeObject.model) {
                    if (modelField.as) {
                        as = modelField.as;
                    }
                    if (includeObject.include && includeObject.include.length !== 0) {
                        nestedInclude = await IncludeRecursive(includeObject.include);
                    }
                    fields.push({
                        model: modelField.model,
                        as: as,
                        attributes: includeObject.attributes,
                        include: nestedInclude,
                    });
                    j = includeFields.length + 1;
                }
            }
        }
        return fields;
    } catch (error) {
        return error.message;
    }
}

async function getAllData(bodyData, model) {
    try {
        let options = {},
            limit = null,
            offset = null,
            pageNo = 0,
            perPage = 0,
            search = null,
            query = {},
            include = [],
            sortBy = [],
            attributes = {};
        if (bodyData.hasOwnProperty("search")) {
            search = bodyData.search;
            delete bodyData.search;
        }
        if (bodyData.hasOwnProperty("options")) {
            options = bodyData.options;
            if (options.hasOwnProperty("include")) {
                include = options.include;
            }
            if (options.hasOwnProperty("sortBy")) {
                sortBy = options.sortBy;
            }
            if (options.hasOwnProperty("attributes")) {
                attributes = options.attributes;
            }
        }
        if (bodyData.hasOwnProperty("query")) {
            query = bodyData.query;
        }
        if (
            search &&
            search.hasOwnProperty("keys") &&
            Array.isArray(search.keys) &&
            search.keys.length
        ) {
            let keyword = [];
            for (let keyIndex = 0; keyIndex < search.keys.length; keyIndex++) {
                const key = search.keys[keyIndex];
                keyword.push({ [key]: { [Op.iLike]: `%${search.value}%` } });
            }
            query[Op.or] = keyword;
        }
        if (include) {
            include = await IncludeRecursive(include);
        }
        if (options.paginate === true) {
            limit = parseInt(options.limit);
            offset = (options.pageNo - 1) * limit;
            pageNo = options.pageNo;
            perPage = options.limit;
        }

        const data = await model.findAll({
            where: {
                [Op.and]: [query],
            },
            attributes: options.attributes,
            include: include,
            limit: limit,
            offset: offset,
            order: options.sortBy,
        });

        const data1 = await model.findAll({
            where: {
                [Op.and]: [query],
            },
        });
        const count = data1.length;

        const Pagination = {
            TotalData: count,
            PageNo: pageNo,
            Limit: perPage,
            Offset: offset,
        };
        return { data: data, paginate: Pagination };
    } catch (error) {
        return error.message;
    }
}

module.exports = { getAllData };