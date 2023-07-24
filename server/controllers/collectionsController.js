const {Collection, Item} = require("../models/models");
const apiError = require("../error/apiError");

class collectionController {

    async create(request, response, next) {

        try {
            let {name, theme, description, images, customFields, userId} = request.body;
            customFields = JSON.parse(customFields);
            const [
                integerField1, integerField2, integerField3,
                textField1, textField2, textField3,
                stringField1, stringField2, stringField3,
                dateField1, dateField2, dateField3,
                boolField1, boolField2, boolField3
            ] = customFields.map(field => field === '' ? null : field);
            const collection = await Collection.create({name, theme, images, description, 
                integerField1, integerField2, integerField3,
                textField1, textField2, textField3,
                stringField1, stringField2, stringField3,
                dateField1, dateField2, dateField3,
                boolField1, boolField2, boolField3, userId});
            return response.json(collection);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }
        
    };

    async getOne(request, response, next) {

        try {     
            const {id} = request.params;
            const collection = await Collection.findOne({where: {id}}); 
            return response.json(collection);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    };

    async getAll(request, response, next) {

        try {
            const collections = await Collection.findAll();
            return response.json(collections);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }
        
    };

    async getAllUserCollections(request, response, next) {

        try {
            let {userId} = request.params;
            let collections; 
            if(userId) {
                collections = await Collection.findAll({where: {userId}});
            }  
            return response.json(collections);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    };

    async deleteCollection(request, response, next) {

        try {         
            let {id} = request.query;
            const item = await Item.destroy({where: {collectionId: id}});  
            const collection = await Collection.destroy({where:{id}});    
            return response.json(collection);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }
    
    };

    async modifyCollection(request, response, next) {

        try {
            let {id} = request.query;
            let {name, theme, description, images, customFields} = request.body;
            customFields = JSON.parse(customFields);
            const [
                integerField1, integerField2, integerField3,
                textField1, textField2, textField3,
                stringField1, stringField2, stringField3,
                dateField1, dateField2, dateField3,
                boolField1, boolField2, boolField3
            ] = customFields.map(field => field === '' ? null : field);   
            let collection = await Collection.update({name, theme, images, description, 
                integerField1, integerField2, integerField3,
                textField1, textField2, textField3,
                stringField1, stringField2, stringField3,
                dateField1, dateField2, dateField3,
                boolField1, boolField2, boolField3}, {where:{id}});   
            return response.json(collection);

        } catch (error) {
            next(apiError.badrequest(error.message));
        }
    };
}

module.exports = new collectionController();
