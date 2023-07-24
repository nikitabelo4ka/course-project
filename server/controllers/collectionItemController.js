const {Item, ItemTag, Tag, Collection, User, Comment, Like} = require("../models/models");
const apiError = require("../error/apiError");

class collectionItemController {

    async create(request, response, next) {

        try {         
            let {name, tags, collectionId, customFields} = request.body;
            tags = JSON.parse(tags);
            customFields = JSON.parse(customFields);
            const [integerField1, integerField2, integerField3,
                textField1, textField2, textField3,
                stringField1, stringField2, stringField3,
                dateField1, dateField2, dateField3,
                boolField1, boolField2, boolField3
            ] = customFields.map(field => field === '' ? null : field);
            const collectionItem = await Item.create({name, collectionId,
                integerField1, integerField2, integerField3,
                textField1, textField2, textField3,
                stringField1, stringField2, stringField3,
                dateField1, dateField2, dateField3,
                boolField1, boolField2, boolField3
            });
            tags.forEach(async (tag) => await Tag.findOrCreate({where: {text: tag}}));
            const tagsDB = await Tag.findAll({where: {text: tags}});
            tagsDB.forEach(tag => ItemTag.findOrCreate({where: {tagId: tag.id, itemId: collectionItem.id}}));             
            return response.json(collectionItem);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async getAllCollectionItems(request, response, next) {

        try {         
            let {collectionId} = request.query;
            const collectionItems = await Item.findAll({where:{collectionId}});  
            return response.json(collectionItems);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async deleteCollectionItem(request, response, next) {

        try {
            let {id} = request.query;
            const comment = await Comment.destroy({where: {itemId: id}});
            const like = await Like.destroy({where: {itemId: id}});
            const collectionItem = await Item.destroy({where: {id}}); 
            return response.json(collectionItem);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async getOneCollectionItem(request, response, next) {

        try {         
            const {id} = request.params;
            const collectionItem = await Item.findOne({where: {id}});
            return response.json(collectionItem);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async getAllItems(request, response, next) {

        try {          
            const items = await Item.findAll();
            return response.json(items);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async modifyCollectionItem(request, response, next) {

        try {
            let {collectionItemId} = request.query;
            let {name, tags, customFields} = request.body;
            customFields = JSON.parse(customFields);
            tags = JSON.parse(tags);
            const [
                integerField1, integerField2, integerField3,
                textField1, textField2, textField3,
                stringField1, stringField2, stringField3,
                dateField1, dateField2, dateField3,
                boolField1, boolField2, boolField3
            ] = customFields.map(field => field === '' ? null : field);    
            let collectionItem = await Item.update({name,
                integerField1, integerField2, integerField3,
                textField1, textField2, textField3,
                stringField1, stringField2, stringField3,
                dateField1, dateField2, dateField3,
                boolField1, boolField2, boolField3}, {where:{id: collectionItemId}});
                const deleteTags = await ItemTag.destroy({where: {itemId: collectionItemId}});
                tags.forEach(async (tag) => await Tag.findOrCreate({where: {text: tag}}));
                const tagsDB = await Tag.findAll({where: {text: tags}});
                tagsDB.forEach(tag => ItemTag.findOrCreate({where: {tagId: tag.id, itemId: collectionItemId}}));    
            return response.json(collectionItem);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }
    }

    async getLatestItems(request, response) {

        let {limit} = request.query;
        limit = limit || 3;
        const items = await Item.findAll({ include: { model: Collection, include: User }, order: [['id', 'DESC']], limit });
        return response.json(items);

    }
}

module.exports = new collectionItemController();
