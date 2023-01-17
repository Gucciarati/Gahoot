let socket = io();
let quizList = []


function RefreshQuizList() {

    console.log("Foram encontrados:" +quizList.length + "quizzes")

    let temp = document.getElementsByTagName("template")[0];
    let item = temp.content;

    let a = document.importNode(item, true);
    let main = document.getElementById("main-row")

    let quizCards = main.querySelectorAll("div")

    quizCards.forEach((card) => {
        card.remove()
    })

    quizList.forEach((quizData) => {

        let a = document.importNode(item, true);    
        document.getElementById("main-row").appendChild(a);

        let newDiv = main.children[main.children.length - 1]


         newDiv.querySelector("h5").innerHTML = quizData.name
    
    })


}   

    socket.on("quiz-list", (data) => {
    
        console.log(quizList)
        console.log("Sheeeesh quiz listttt")

        quizList = data

        RefreshQuizList()

    })


/*
POR FAZER:
-Modo verdadeiro/falso
-Fazer com que texto inserido não seja apagado ao criar novos botões
*/