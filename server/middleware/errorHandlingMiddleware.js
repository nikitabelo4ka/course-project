const apiError = require("../error/apiError");

module.exports = function (error, response) {
    if (error instanceof apiError) {
        return response.status(error.status).json({message: error.message});
    }
    return response.status(500).json({message: "Непредвиденная ошибка !"});
}
