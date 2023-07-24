const {Tag, ItemTag} = require("../models/models");
const apiError = require("../error/apiError");
const sequelize = require('../db')

class tagsController {

    async getAll(request, response, next) {

        try {
            const tags = await Tag.findAll();
            return response.json(tags);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async getAllItemsTags(request, response) {

        try {
            const {itemId} = request.params;
            let tagsArr = [];
            const tagsId = await ItemTag.findAll({where: {itemId}});
            for(let i = 0; i < tagsId.length; i += 1) {
                const tag = await Tag.findAll({where: {id: tagsId[i].tagId}});
                tagsArr.push(tag);
            }
            return response.json(tagsArr);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async getPopular(request, response) {

        let limit = 40;

        const tagsCount = await ItemTag.findAll({
            attributes: ['tagId', [sequelize.fn('COUNT', sequelize.col('id')), 'tagCount']],
            group: ['tagId'],
            order: [['tagCount', 'DESC']],
            limit,
        });
        const tagsId = tagsCount.map((tag) => tag.tagId);
        const tags = await Tag.findAll({where: {id: tagsId}});
        return response.json({tagsCount, tags});
    }
}

module.exports = new tagsController();
