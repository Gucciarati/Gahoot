
let socket = io();

let playerOptionsTemplate = document.getElementById("player-options")
let mainContainer = document.getElementById("mainContainer")

let answerTimeStart

function JoinRoom() {

    let provisionalId = localStorage.getItem("provisionalId")
    render("")
    if (provisionalId) {
        console.log(provisionalId)
        socket.emit("join-room", provisionalId, (joined) => {

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


function OnAnswer(answer) {

    if (canAnswer) {
        canAnswer = false

        let answerInfo = { answer, answerTime: ((new Date() - answerTimeStart) / 1000) }
        console.log(answerTimeStart, answerInfo)
        if (answerInfo.answerTime <= 3) {

            document.getElementById("waiting-extraInfo").textContent = "⚡Wooow, essa resposta foi tão rapida que os nossos computadores quase não a conseguiram processar😩⚡"

        } else if (answerInfo.answerTime <= 7) {
            document.getElementById("waiting-extraInfo").textContent = "Será que acertaste?👀"
        } else {
            document.getElementById("waiting-extraInfo").textContent = "Quase adormeci enquanto esperava por essa resposta?😴"
        }

        socket.emit("player-answer", answerInfo)



        render("waiting-result")
    }


}

socket.on("player-answer-feedback", (game) => {

    let player = game.members.filter((member) => member.playerId == socket.id)
    if (player && player.length === 1) {
        player = player[0]
    }

    let points = 0

    let answerToCurrent = false


    player.answers.forEach((answer) => {
        console.log(answer.questionNumber, game.currentQuestion, console.log())
        if (answer.questionNumber === game.currentQuestion) {
            answerToCurrent = answer
        }

    })

    console.log(answerToCurrent, game, player)

    document.getElementById("nicknameText").textContent = player.nickname
    document.getElementById("pointsText").textContent = player.points

    if (answerToCurrent && answerToCurrent.pointsGained > 0) {
        document.getElementById("answer-feedback-img").src = "/media/imagens/check.png"
        document.getElementById("answer-feedback-title").textContent = "Acertaste!"
        document.getElementById("answer-feedback-smallText").textContent = "+ " + answerToCurrent.pointsGained + " Pts"
    } else if (answerToCurrent) {
        document.getElementById("answer-feedback-img").src = "/media/imagens/cancel.png"
        document.getElementById("answer-feedback-title").textContent = "Errado!"
        document.getElementById("answer-feedback-smallText").textContent = "+ " + answerToCurrent.pointsGained + " Pts"
    } else {
        document.getElementById("answer-feedback-img").src = "/media/imagens/clock.png"
        document.getElementById("answer-feedback-title").textContent = "Não respondeste a tempo!"
        document.getElementById("answer-feedback-smallText").textContent = "+ " + "0" + " Pts"

    }

    k = game.members.sort(function (a, b) { return b.points - a.points });
     console.log(game.members)
    
     let placement = game.members.length
    let index = 0
    game.members.forEach((member) => {

        placement -= 1 // Se estiveres fores o 3 membro de uma lista de 10 jogadores, placement == 7
        index += 1 //Conta a lista a partir de baixo

        if (player.playerId == member.playerId ) {
            
            if (index > 1) {

                document.getElementById("answer-feedback-extraInfo").textContent = "Estás em " + index + "º lugar, atrás de " + game.members[index -2].nickname
                console.log("Estás em " + index + "º lugar, atrás de " + game.members[index - 2].nickname)
            } else if (index == 1) {
    
                document.getElementById("answer-feedback-extraInfo").textContent = "Estás em 1º lugar🏆"
                
            } else {
                document.getElementById("answer-feedback-extraInfo").textContent = "Não foi possivel determinar a tua posição. " + index + ", " + game.members[index - 2].nickname
            }
        }


        

    })


    render("answer-feedback")
})

socket.on("next-question-player", (game) => {

    console.log("recieved")

    if (game && game.currentQuestion >= game.quizData.perguntas.length) {
        return render("quiz-end");
    }

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
