const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const User = sequelize.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    firstName: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING, defaultValue: "ACTIVE"},
    role: {type: DataTypes.STRING, defaultValue: "USER"}
})

const Collection = sequelize.define('collection', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING},
    theme: {type: DataTypes.STRING, allowNull: false},
    images: {type: DataTypes.STRING},
    integerField1: {type: DataTypes.STRING},
    integerField2: {type: DataTypes.STRING},
    integerField3: {type: DataTypes.STRING},
    textField1: {type: DataTypes.STRING},
    textField2: {type: DataTypes.STRING},
    textField3: {type: DataTypes.STRING},
    stringField1: {type: DataTypes.STRING},
    stringField2: {type: DataTypes.STRING},
    stringField3: {type: DataTypes.STRING},
    dateField1: {type: DataTypes.STRING},
    dateField2: {type: DataTypes.STRING},
    dateField3: {type: DataTypes.STRING},
    boolField1: {type: DataTypes.STRING},
    boolField2: {type: DataTypes.STRING},
    boolField3: {type: DataTypes.STRING},
});

const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    integerField1: {type: DataTypes.INTEGER},
    integerField2: {type: DataTypes.INTEGER},
    integerField3: {type: DataTypes.INTEGER},
    textField1: {type: DataTypes.STRING},
    textField2: {type: DataTypes.STRING},
    textField3: {type: DataTypes.STRING},
    stringField1: {type: DataTypes.TEXT},
    stringField2: {type: DataTypes.TEXT},
    stringField3: {type: DataTypes.TEXT},
    dateField1: {type: DataTypes.DATE},
    dateField2: {type: DataTypes.DATE},
    dateField3: {type: DataTypes.DATE},
    boolField1: {type: DataTypes.BOOLEAN},
    boolField2: {type: DataTypes.BOOLEAN},
    boolField3: {type: DataTypes.BOOLEAN},
});

const Tag = sequelize.define('tag', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING, unique: true, allowNull: false},
});

const ItemTag = sequelize.define('itemTag', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const Comment = sequelize.define('comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.TEXT, allowNull: false},
    userName: {type: DataTypes.TEXT, allowNull: false},
});
  
const Like = sequelize.define('like', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

User.hasMany(Collection);
Collection.belongsTo(User);

Collection.hasMany(Item);
Item.belongsTo(Collection);

Tag.belongsToMany(Item, {through: ItemTag});
Item.belongsToMany(Tag, {through: ItemTag});

User.hasMany(Comment);
Comment.belongsTo(User);

Item.hasMany(Comment);
Comment.belongsTo(Item);

User.hasMany(Like);
Like.belongsTo(User);

Item.hasMany(Like);
Like.belongsTo(Item);

module.exports = {
    User,
    Collection,
    Item,
    Tag,
    ItemTag,
    Comment,
    Like
}
