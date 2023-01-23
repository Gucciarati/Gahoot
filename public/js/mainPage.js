
let socket = io()

let form = document.getElementById("joinRoomForm")
console.log(window.location)

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
                window.location.assign(window.location.origin + "/questionPlayer")
            } else {
                alert("Não foi encontrada nenhuma sala com o código inserido. Certifique-se de ter escrito o código sem erros.");
            }

        })

    } else {

        if (gamePin.value.length !== 9) {
            alert("O código de sala tem de ser um número de 9 dígitos e sem espaços.");
        } else  {
            alert("O nome de utilizador tem de ter mais de 1 letra");
        }

        console.log("Informação invalida")
        console.log("username length: "+ username.value.length + "("+username.value+ ")" )
        console.log("gamePin length: "+ gamePin.value.length + "("+gamePin.value+ ")")
        
    }


}

form.addEventListener("submit", function (e) {
    e.preventDefault();
  
    JoinRoom()
})  