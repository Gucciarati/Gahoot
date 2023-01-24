
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
            render("waiting-room")

        } else {
            alert("Sala inválida, por favor volte à pagina principal");
        }

    })
    }

}

let blacklist = ["Hugh Jass,Mike Hawk ,Ben Dover, Peter File ,Chris Peacock ,Heywood Jablowme, Wilma Diqfit ,Nick Gah ,Dixie Normous, Barry McKockiner,Duncan McOkiner,Hugh G. Rection, Mike Oxlong ,Phil McCraken,Ifarr Tallnight,Gabe Itch,Moe Lester,Phil Mias,Justin Herass,Todd Lerfondler,Gabe Utsecks,Stan Keepus,Tara Dikoff,Eric Shawn,Alpha Q,Hugh Janus,Mike Rotch Burns,Pat Myaz,Betty Phucker,Knee Grow,Ms. Carriage,Ray Pist,Harry Anoos,Maya Normus Bhut,E. Rec Sean,Dang Lin Wang,Anna Borshin,Hari Balsac,Ped O’Phyl,Wilma Dikfit,School Kahooter,Tera Wrist,York Oxmall"]


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
            
            document.getElementById("nicknameText").textContent = player.nickname
            document.getElementById("pointsText").textContent = player.points

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

           k = game.members.sort(function(a, b){return b.points - a.points});
console.log(k,game.members)
            let placement = 0
            game.members.forEach((member) =>{
          
                placement+=1
          
                if (player.playerId == member.playerId && placement >= 2) {
                  
                    document.getElementById("answer-feedback-extraInfo").textContent = " Tás em " +placement+ "º lugar, atrás de " + game.members[placement - 2].nickname 
                    

                } else {
                    
                    document.getElementById("answer-feedback-extraInfo").textContent = "Tás em 1º lugar🏆"

                }
          
            })


            render("answer-feedback")
})

socket.on("next-question-player", (game)=>{

console.log("recieved")

    let questionPage = "options-" + game.quizData.perguntas[game.currentQuestion - 1].tipo;
      render(questionPage);

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
