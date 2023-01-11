const express = require("express");
const app = express();
const server = require('http').createServer(app);
const {Server}= require('socket.io');
const io = new Server(server)
const port = process.env.PORT || 3000;


const path = require("path");
const router = express.Router();

const bodyParser = require("body-parser")
const publicPath = (__dirname + "/public");

const mongoose = require("mongoose");
const { Console } = require("console");

mongoose.set('strictQuery', false)

async function IniciarBD() {

const connectionParams = {
useNewUrlParser: true,
useUnifiedTopology: true,
}
try {
   await mongoose.connect("mongodb+srv://Gucci:shaboo@cluster0.rrgexi9.mongodb.net/?retryWrites=true&w=majority",connectionParams)
    console.log("Conectado à base de dados com sucesso!")
} catch (error) {

    console.log(error)

}

}

IniciarBD()

server.listen(port, () => {
    console.log(`Servidor iniciado no port: ${port}`);
 })
  

app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({extended:true}))



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/index.html");
});

app.get("/lobby", (req, res) => {
    res.sendFile(__dirname + "/html/lobby.html");
});


app.get("/criar", (req, res) => {
  res.sendFile(__dirname + "/html/criar.html");
});

app.get("/criarSala", (req, res) => {
    res.sendFile(__dirname + "/html/criarSala.html");
  });

const quizSchema = new mongoose.Schema({
    name:  {type:String, required:true},
    author: String,
    perguntas: [{ pergunta: String, tipo: String, opcoes:[String] }],
  
  });
  
  const Quiz = mongoose.model("Quiz",quizSchema)

io.on("connection",socket => {

    console.log("conectado ao socket com sucesso!")
    
    socket.on("salvar-quiz", (quizData) => {

        novoQuiz = new Quiz(quizData);
         novoQuiz.save()

       
    })

    const quizzes = Quiz.find({})
    console.log(quizzes)
    socket.emit("quiz-list",quizzes)
})

