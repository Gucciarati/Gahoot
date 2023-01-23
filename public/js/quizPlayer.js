
let socket = io();

let playerOptionsTemplate = document.getElementById("player-options")
let mainContainer = document.getElementById("mainContainer")

let answerTimeStart

function JoinRoom() {

    let provisionalId = localStorage.getItem("provisionalId")
    
    if (provisionalId) {
        console.log(provisionalId)
    socket.emit("join-room", provisionalId, (joined)=> {

        if (joined) {
            console.log(socket.id)

        } else {
            alert("Sala inválida, por favor volte à pagina principal");
        }

    })
    }

}


function OnAnswer(answer){

    if (canAnswer) {
        canAnswer= false

        let answerInfo =  {answer,answerTime: ((  new Date() - answerTimeStart)/1000)}
        console.log(answerTimeStart,answerInfo)
        if (answerInfo.answerTime <= 2) {


        }  else {

        }

        socket.emit("player-answer",answerInfo)



        render("waiting-result")
    }
       
     
}

socket.on("player-answer-feedback",(game) => {

        let player = game.members.filter((member) => member.playerId == socket.id)
            if (player && player.length === 1) {
                player = player[0]
            }

            let points = 0
           
            let answerToCurrent = false


            player.answers.forEach((answer) =>{
                    console.log(answer.questionNumber, game.currentQuestion, console.log())
                if (answer.questionNumber === game.currentQuestion) {
                    answerToCurrent = answer
                }

            })

            console.log(answerToCurrent,game,player)

        if ( answerToCurrent && answerToCurrent.pointsGained > 0 ) {
            document.getElementById("answer-feedback-img").src = "/media/imagens/check.png"
            document.getElementById("answer-feedback-title").textContent = "Acertaste!"
            document.getElementById("answer-feedback-smallText").textContent = "+ " + answerToCurrent.pointsGained + " Pts"
        } else if (answerToCurrent ) {
            document.getElementById("answer-feedback-img").src = "/media/imagens/cancel.png"
            document.getElementById("answer-feedback-title").textContent = "Errado!"
            document.getElementById("answer-feedback-smallText").textContent = "+ " + answerToCurrent.pointsGained + " Pts"
        }  else {
            document.getElementById("answer-feedback-img").src = "/media/imagens/clock.png"
            document.getElementById("answer-feedback-title").textContent = "Não respondeste a tempo!"
            document.getElementById("answer-feedback-smallText").textContent = "+ " + "0" + " Pts"

        }

            game.members.sort(function(a, b){return a.points - b.points});

            let placement = 0
            game.members.forEach((player) =>{
          
                placement+=1
          
                if (player.nickname == player.nickname && placement > 2) {
                  
                    document.getElementById("answer-feedback-extraInfo").textContent = " Tás em " +placement+ " lugar, atrás de " + game.members[placement - 2].nickname 
                    

                } else {
                    
                    document.getElementById("answer-feedback-extraInfo").textContent = "Tás em 1º lugar🏆"

                }
          
            })


            render("answer-feedback")
})

socket.on("next-question-player", (game)=>{

console.log("recieved")

    render("options")
    canAnswer = true
    answerTimeStart = new Date();

})

function render(pageId) {

    document.querySelectorAll(".page").forEach(page => {
  
      if (page.id === pageId) {
  
        page.style.display = "block"
  
      } else {
  
        page.style.display = "none"
  
      }
  
    })
  
  }

window.onload = JoinRoom;




/*
POR FAZER:
-Modo verdadeiro/falso
-Fazer com que texto inserido não seja apagado ao criar novos botões
-Melhorias na UI
*/
