

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
const { isNullOrUndefined } = require("util");

//Import classes
const {LiveGames} = require('./servidor/utils/liveGames');
//const {Players} = require('./utils/players');

const games = new LiveGames

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

const quizSchema = new mongoose.Schema({
    name:  {type:String, required:true},
    author: String,
    perguntas: [{ pergunta: String, tipo: String, opcoes:[String] }],
  
  });
  
  const Quiz = mongoose.model("Quiz",quizSchema)

server.listen(port, () => {
    console.log(`Servidor iniciado no port: ${port}`);
 })
  

app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({extended:true}))



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/lobby", (req, res) => {
    res.sendFile(__dirname + "/public/html/lobby.html");
});

app.get("/questionPlayer", (req, res) => {
  res.sendFile(__dirname + "/public/html/questionPlayer.html");
});

app.get("/criar", (req, res) => {
  res.sendFile(__dirname + "/public/html/criar.html");
});

app.get("/criarSala", (req, res) => {
    res.sendFile(__dirname + "/public/html/criarSala.html");

  });

  app.get("/question", (req, res) => {
    res.sendFile(__dirname + "/public/html/question.html");
  });

  app.get("/leaderboard", (req, res) => {
    res.sendFile(__dirname + "/public/html/leaderboard.html");
  });

io.on("connection",socket => {

    console.log("conectado ao socket com sucesso!")
    
    socket.on("salvar-quiz", (quizData) => {
  
        novoQuiz = new Quiz(quizData);
         novoQuiz.save()
        
    })

    socket.on("create-room", async (quizId, sendPin) => {

      const foundQuiz = await Quiz.where("_id").equals(quizId).limit(1)
    console.log(foundQuiz[0])
      if (foundQuiz[0]) {
      
        let roomID = ""  //Numero aleatório de 9 digitos

        for (let i = 0; i < 3; i++) {
          roomID += String(Math.round(Math.random() * (999- 100) + 100)) //Numero aleatório de 93digitos

          if (i <= 1 ) {
              roomID += " "
          }

        }


        games.addGame(roomID,socket.id || socket.id,foundQuiz[0])

        console.log("created room",roomID)
   
      }

  })

  socket.on("host-join", (hostId, pin) => {

    let g = games.getGame(hostId)
    g.hostId = socket.id
    if (g) {
      pin(g.pin)
    } else {
      console.log("No room with hostID " + hostId + " found")
    }

  })


  socket.on("join-provisional",  (playerInfo,joined) => {

    let g = games.getGame(0,playerInfo.gamePin)

    if (g) {
    
     let game = games.addPlayer(playerInfo,socket.id)
      joined(true)
      io.emit("update-players",game)

    } else {
      console.log("Sala não encontrada")
      joined(false)
    }

})


socket.on("join-room", (provisionalId,joined)=>{

  console.log("Joining room")
  let playerInfo = games.editPlayer(provisionalId,socket.id)
  let player = playerInfo.foundPlayer
 
  if (player) {
    socket.join(playerInfo.gamePin)
    console.log(player.nickname + " Joined successfully")
    joined(true)
  } else {
    joined(false)
  }

})


socket.on("next-question", (reason,sendGame) =>{

  let game = games.getGame(socket.id,0)
  game.currentQuestion +=1

  sendGame(game)
  
  io.to(game.pin).emit("next-question-player",game)

})


socket.on("player-answer", (answer) =>{

  let player = games.editPlayer(socket.id,socket.id)
  console.log(player)
  let game = games.getGame(0,player.gamePin)

  player.foundPlayer.answers.push({questionNumber:game.currentQuestion,answer})

  console.log(game)

})


    const find = Quiz.find( (err,data) => {
        io.emit("quiz-list",data)
     })

})
