
let socket = io();

let playerOptionsTemplate = document.getElementById("player-options")
let mainContainer = document.getElementById("mainContainer")

function JoinRoom() {

    let provisionalId = localStorage.getItem("provisionalId")
    
    if (provisionalId) {
        console.log(provisionalId)
    socket.emit("join-room", provisionalId, (joined)=> {

        if (joined) {
            console.log(socket.id)

        } else {
            console.log("Algo deu errado ao tentar juntar-se a sala",provisionalId)
        }

    })
    }

}


function OnAnswer(answer){

    if (canAnswer) {
        canAnswer= false

        socket.emit("player-answer",answer)
    }
       
     
}

socket.on("next-question-player", (game)=>{

console.log("recieved")
    mainContainer.appendChild(document.importNode(playerOptionsTemplate.content, true))
  
    canAnswer = true
    

})

socket.onAny((eventName, ...args) => {
   console.log("onAny")
  });

window.onload = JoinRoom;

/*
POR FAZER:
-Modo verdadeiro/falso
-Fazer com que texto inserido não seja apagado ao criar novos botões
-Melhorias na UI
*/
