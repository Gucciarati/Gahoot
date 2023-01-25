
let socket = io()

let form = document.getElementById("joinRoomForm")
console.log(document.getElementById("bg-music").canPlayType("audio/mp4"))
var audio = document.createElement('audio');
var source = document.createElement('source');
var media = document.getElementById('media');

let isPlaying = false

const animateCSS = (element, animation, prefix = 'animate__') =>
// We create a Promise and return it
new Promise((resolve, reject) => {
  const animationName = `${prefix}${animation}`;
  const node = document.querySelector(element);

  node.classList.add(`${prefix}animated`, animationName);

  // When the animation ends, we clean the classes and resolve the Promise
  function handleAnimationEnd(event) {
    event.stopPropagation();
    node.classList.remove(`${prefix}animated`, animationName);
    resolve('Animation ended');
  }

  node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

animateCSS('#starterText', 'flipInX').then(()=>{
    animateCSS('#starterSmallText', 'fadeIn')
})

window.addEventListener('click', (event) => {
   if (!isPlaying) {
    isPlaying = true
    document.getElementById("bg-music").load()
    document.getElementById("bg-music").play()
    
    animateCSS('#starter', 'fadeOutUp').then((message) => {
        render("main")
        animateCSS('#main', 'fadeIn')
      });
   }
  })

function JoinRoom() {

    let username = document.getElementById("nicknameText")
let gamePin = document.getElementById("gamePinText")

    if (username.value.length > 1 && username.value.length <= 20 && gamePin.value.length === 9) {

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
            alert("O nome de utilizador tem de ter entre 2-20 letras");
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

function render(pageId) {
    document.querySelectorAll(".page").forEach((page) => {
      if (page.id === pageId) {
        page.style.display = "block";
      } else {
        page.style.display = "none";
      }
    });
  }

 

  render("starter")