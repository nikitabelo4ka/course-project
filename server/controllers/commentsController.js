const {Comment} = require("../models/models");
const apiError = require("../error/apiError");

class commentsController {

    async createComment(reqBody, next) {

        let {userId, userName, itemId, text} = reqBody;
        const comment = await Comment.create({userId, userName, itemId, text});  
        return comment;          
    }

    async getItemsComments(request, response, next) {

        try {           
            let {itemId} = request.query;
            const comments = await Comment.findAll({where: {itemId}});   
            return response.json(comments);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }
    }

    async deleteComment(reqParams) {
           
        let {id} = reqParams;
        const comment = await Comment.destroy({where: {id}}); 
        return id;

    }
}

module.exports = new commentsController();
