import express from "express"
import { Server } from "socket.io"
import handlebars from "express-handlebars";
import __dirname from "./util.js";

const app = express();

//! Middleware & Static

app.use(express.json())
app.use("/static", express.static(__dirname + "/public"))

//! Handlebars Config.

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

//! CRUDS

const chatMessages = []

app.get("/", (req, res) => {
    res.render("home", { chatMessages })
})

//! Servers

const serverExpress = app.listen(8080, () => {
    console.log("Server ON. Puerto 8080");
})

const socketServer = new Server(serverExpress); // 1. Creamos un nuevo Server de Socket con nuestro Server de Express.

// ON: Suscribirse a un evento

socketServer.on("connection", (socket) => {
    console.log(`Se conecto a traves de Socket un dispositivo con ID: ${socket.id}`); // 2. Utilizamos el evento "connection" para saber cuando un Socket se conecta.

    // Emit envia informacion a todos los Socket conectados. Recibe 2 parametros (evento, mensaje).
    
    socket.on("mensaje", (data) => {
        console.log(`El usuario envio esto -> ${data}`);
        chatMessages.push(data)
        socketServer.emit("chat-logs", chatMessages)
        console.log(chatMessages);
    })

    socket.on("nueva-conexion", username => {
        socket.broadcast.emit("nueva-conexion", username)
    })
})

