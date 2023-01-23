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

function updateTimer(){
  let time = 20;
  timer = setInterval(function(){
      time -= 1;
      document.getElementById('timer').textContent = " " + time


      if(time <= 0 && skipped === false){
         StartQuestion("TimeUp")
      } else if (skipped) {

        StartQuestion("Skipped")

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

      document.getElementById("leaderboard-ul").appendChild(li)
    
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
  if (timer) {clearInterval(timer)}




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
