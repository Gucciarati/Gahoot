

let Nperguntas = 0;

io.on("connection",(socket) => {

    socket.on("quiz-list", (quizList) => {
        console.log(quizList)
        console.log("Sheeeesh quiz listttt")
    })

} )


/*
POR FAZER:

-Modo verdadeiro/falso
-Fazer com que texto inserido não seja apagado ao criar novos botões

*/
