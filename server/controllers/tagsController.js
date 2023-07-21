const {Tag, ItemTag} = require("../models/models");
const apiError = require("../error/apiError");

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
}

module.exports = new tagsController();
