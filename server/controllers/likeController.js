const {Like} = require("../models/models");
const apiError = require("../error/apiError");

class likeController {

    async create(request, response, next) {

        try { 
            let {userId, itemId} = request.body;
            const like = await Like.create({userId, itemId});
            return response.json(like);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async delete(request, response, next) {

        try {            
            let {userId, itemId} = request.query;
            const like = await Like.destroy({where: {userId, itemId}}); 
            return response.json(like);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async getAllUserLikes(request, response, next) {
        
        const {userId} = request.params;
        const likes = await Like.findAll({where: {userId}});
        return response.json(likes);

    }

    async getAllItemLikes(request, response, next) {

        const {itemId} = request.params;
        const likes = await Like.findAll({where: {itemId}});  
        return response.json(likes);
    }
}

module.exports = new likeController();
