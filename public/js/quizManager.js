let socket = io();

let playerButtonTemplate = document.getElementById("playerButtonTemplate")
let playerContainer = document.getElementById("playerContainer")
let playerContainerParent = document.getElementById("playerContainerParent")
let starterNav = document.getElementById("starterNav")
let mainContainer = document.getElementById("mainContainer")
let questionsNav = document.getElementById("questionsNav")
let questionsTemplate = document.getElementById("questionsTemplate")

//leaderboad
let leaderboadContent = document.getElementById("leaderboardContent")
let leaderboardItem = document.getElementById("leaderboard-item")
let leaderboardNav = document.getElementById("leaderboard-nav")

let skipped = false
let timer

function HostQuiz() {

  render("lobby")

    let hostID = localStorage.getItem("hostId");
  if (hostID) {

    console.log();
   
    socket.emit("host-join", hostID, (pin) => {
      document.querySelector(".pinText").innerHTML = pin;
    });

  }
}

function StartQuiz() {

  render("question")

  StartQuestion()

}

function updateTimer(game){
  let time = 20;
  document.getElementById('timer').textContent = " " + time

  timer = setInterval(function(){
      time -= 1;
      document.getElementById('timer').textContent = " " + time


      if(time <= 0 && skipped === false){

        setTimeout(() => StartQuestion("TimeUp"),5000)
        ShowCorrect(game)
      } else if (skipped) {

        setTimeout(() => StartQuestion("Skipped"),5000)
        ShowCorrect(game)
      }
  }, 1000);
}

function MakeLeaderboard(game) {

  render("leaderboard")

  let leaderboardSize = 5
  let leaderboardCount = 0

  game.members.sort(function(a, b){return a.points - b.points});

  game.members.forEach((player) =>{
    
    if (leaderboardCount< leaderboardSize) {

      leaderboardCount+=1

     let li = document.importNode(leaderboardItem.content,true) 
    
      li.querySelectorAll("h1")[0].textContent = player.nickname
      li.querySelectorAll("h1")[1].textContent = player.points

      document.getElementById("leaderboard-container").appendChild(li)

      li = document.getElementById("leaderboard-container").querySelectorAll("li")[leaderboardCount-1]

      if (leaderboardCount == 1 ) {
        
        li.className = "list-group-item rounded list-group-item-warning "

      } else if (leaderboardCount == 2) {
        li.className = "list-group-item rounded list-group-item-secondary "

      } else if (leaderboardCount == 3) {
        li.className = "list-group-item rounded list-group-item-danger"

      } else {
        li.className = "list-group-item rounded color-background text-light "

      }

     
    
    }
  })


}


function render(pageId) {

  document.querySelectorAll(".page").forEach(page => {

    if (page.id === pageId) {

      page.style.display = "block"

    } else {

      page.style.display = "none"

    }

  })

}

function StartQuestion(reason) {
  skipped = false
  
  document.querySelectorAll(".optionButton").forEach(button =>{

      button.disabled = false
  })

  socket.emit("next-question", reason,(game) => {

    if ( game && game.currentQuestion >= game.quizData.perguntas.length ) {

      return MakeLeaderboard(game)
    }

    updateTimer(game)

    document.getElementById("questionText").textContent = game.quizData.perguntas[game.currentQuestion].pergunta

    for (let i=1; i < 5; i++) {

      document.getElementById("q"+String(i)).textContent = String(i) + ". " + game.quizData.perguntas[game.currentQuestion].opcoes[i-1]

    }

  })

}

function Skip() {
  skipped = true
}

function ShowCorrect(game) {
  if (timer) {clearInterval(timer)}
  let correta = game.quizData.perguntas[game.currentQuestion-1].correta

  document.querySelectorAll(".optionButton").forEach(button =>{

    if (button.id == "q" + correta) {

      button.disabled = false

    } else {
      button.disabled = true
    }

  })

  socket.emit("send-player-answer-feedback")

}

socket.on("update-players", (game)=>{

  console.log(game,playerContainer.children)

  playerContainer.querySelectorAll(".playerCard").forEach(child =>{
    child.remove()
  })

  game.members.forEach(player => {
    
  let item = playerButtonTemplate.content
    let a = document.importNode(item, true);

    a.querySelector("h1").innerHTML = player.nickname
    playerContainer.appendChild(a)

  });

})


window.onload = HostQuiz;

/*
POR FAZER:
-Modo verdadeiro/falso
-Fazer com que texto inserido não seja apagado ao criar novos botões
-Melhorias na UI
*/
