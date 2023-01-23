
let socket = io()

let form = document.getElementById("joinRoomForm")


function JoinRoom() {

    let username = document.getElementById("nicknameText")
let gamePin = document.getElementById("gamePinText")

    if (username.value.length > 1 && gamePin.value.length === 9) {

        let nicknameText = username.value
        let gamePinText = gamePin.value

        console.log(socket.id)
        localStorage.setItem("provisionalId",socket.id)

        socket.emit("join-provisional", {nickname:nicknameText,gamePin:gamePinText }, (joined) =>{
            
            if (joined) {
                window.location.assign("http://localhost:3000/questionPlayer")
            } else {
                console.log("Nao foi encontrada nenhuma sala")
            }

        })

    } else {
        console.log("Informação invalida")
        console.log("username length: "+ username.value.length + "("+username.value+ ")" )
        console.log("gamePin length: "+ gamePin.value.length + "("+gamePin.value+ ")")
        
    }


}

form.addEventListener("submit", function (e) {
    e.preventDefault();
  
    JoinRoom()
})  