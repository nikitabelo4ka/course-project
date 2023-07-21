require("dotenv").config()
const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorHandlingMiddleware");
const ImageKit = require('imagekit');
const PORT = process.env.PORT || 5000
const app = express();
const http = require("http").Server(app);
const formData = require("express-form-data");
const commentsController = require('./controllers/commentsController');

const imagekit = new ImageKit ({
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_SECRET_KEY
});

const io = require("socket.io")(http, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
});

io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
  
    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
    });
});

app.use(cors());
app.use(express.json());
app.use(formData.parse());
app.use("/api", router);

app.get('/api', function (req, res) {
    let result = imagekit.getAuthenticationParameters();
    res.send(result);
});

app.post("/api/comments/create", async (req, res, next) => {
    const comment = await commentsController.createComment(req.body);
    io.emit("new-comment", { comment });
    res.json(comment);
});

app.delete("/api/comments/itemComments/delete/:id", async (req, res) => {
    const id = await commentsController.deleteComment(req.params);
    io.emit("delete-comment", { id });
    res.json(id);
});

app.get('/api/comments/itemComments', commentsController.getItemsComments);

app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};

start();
