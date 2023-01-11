let socket = io()

let Nperguntas = 0;
let form = document.getElementById("form");

let radioButtonIDs = ["check1","check2","check3","check4"]
let textInputIDs = ["op1","op2","op3","op4"]

function ApagarPergunta() {
  document.removeChild(getElementsByClassName("main")[Nperguntas]);
}

function AtualizarNomes(div) {

  let inputs = div.querySelectorAll("input")
  let caixasTexto = 1
  let radios = 1
  inputs.forEach((child,i) => {
    if (child.type === "radio" ) {

      child.name =div.id
      child.id= radios
      radios +=1
    } else if (child.type ==="text" && child)    {

      child.id =  caixasTexto + div.id + "-"
      caixasTexto+=1
    } 
  });


}

function AdicionarPergunta() {
  Nperguntas += 1;
  let deleted = 0;
  let criado = 0;

  console.log(Nperguntas);

  let temp = document.getElementsByTagName("template")[0];
  let item = temp.content;
  let perguntasElements = document.getElementsByClassName("perguntas");

  console.log(perguntasElements);
  console.log(perguntasElements.length);

  let get = document.querySelectorAll(".perguntas");
  get.forEach((element) => {
    deleted += 1;
    element.remove();
  });

  console.log("Apagado:", deleted);

  for (i = 1; i <= Nperguntas || (i === 1 && Nperguntas === 1); i++) {
    criado += 1;
    let a = document.importNode(item, true);
    let main = document.getElementById("main")
    console.log(a.id);
    a = document.getElementById("main").appendChild(a);
    let newDiv = main.children[main.children.length - 1]
    newDiv.id = i;
    AtualizarNomes(newDiv)
      
  }
  console.log("Criado:", criado);
}


form.addEventListener("submit", function (e) {
  e.preventDefault();


  let perguntasDivs = document.querySelectorAll(".perguntas");
  let perguntasData = {
    name:  document.getElementById("titulo-quiz").value,
    author: String,
    perguntas: [],
    date: { type: Date, default: Date.now },
  
  }


  perguntasDivs.forEach((pDivs) => {

    let inputs = pDivs.querySelectorAll("input")
    let select = pDivs.querySelectorAll("select")[0]
    let p = {
      pergunta:"",
      tipo:select.value,
      opcoes:[]
    }

    inputs.forEach((child,i) => {
      if (child.type === "radio" && child.checked ) {
  
        p.correta = child.id
      } else if (child.type ==="text" &&child.classList.contains("pergunta-nome"))    {
      console.log(child.classList.contains("pergunta-nome"))
    
   
      p.pergunta = child.value
       
      } else if (child.type ==="text" ) {
        p.opcoes.push(child.value)
      }
    });

    perguntasData.perguntas.push(p)
  });


console.log(perguntasData)
socket.emit("salvar-quiz",perguntasData)
});

/*
POR FAZER:

-Modo verdadeiro/falso
-Fazer com que texto inserido não seja apagado ao criar novos botões

*/
