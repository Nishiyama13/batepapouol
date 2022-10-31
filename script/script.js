//variáveis globais

//var for cadastro de usuário
let nomeNovoUsuario = "";

//programa
buscarNomeDisponivel();
buscarMsgs();
keepConnection();
keepMsgUpdated();

//funções

//conferir disponibilidade do nome
function buscarNomeDisponivel() {
  nomeNovoUsuario = prompt("Qual deseja ser o seu nome de usuário?");

  let userName = { name: nomeNovoUsuario };
  const promessa = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    userName
  );
  console.log("Pedido de conferencia de user disponível enviado.");
  promessa.then(cadastrarUsuario); //deu certo
  promessa.catch(erroNoCadastro); //deu erro
}

function cadastrarUsuario() {
  console.log("cadastro realizado com sucesso!");
  console.log(carregarUsersList());
}

function carregarUsersList() {
  const primise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/participants"
  );
  primise.then(console.log);
  primise.catch(console.log);
}

//Posso colocar informação para os possiveis erros
function erroNoCadastro(erro) {
  console.log("Deu erro na aquisição de dados");

  if (erro.response.status === 400) {
    alert("Nome de usuário já cadastrado, informe um novo nome");
    buscarNomeDisponivel();
  } else {
    alert("Deu erro!");
    console.log("Deu erro!");
    console.log(erro.response.status); //ver o erro que deu
  }
}
/*end cadastro de novo usuário*/

/*Renderizando msgs*/
function renderizarMenssagem(event) {
  const chatElement = document.querySelector(".bodyChat");
  let li = document.createElement("li");
  if (event.type === "status") {
    li.className = "msgStatus";
    li.innerHTML = ` (${event.time})<strong>${event.from}</strong>&nbsp;${event.text}`;
    chatElement.appendChild(li);
  }

  if (event.type === "private_message" && event.to === "Private") {
    li.className = "msgPrivada";
    li.innerHTML = ` (${event.time})<strong>${event.from}</strong>&nbsp; reservadamente para &nbsp; <strong>${event.to}</strong>:&nbsp; ${event.text}`;
    chatElement.appendChild(li);
  } else if (event.type === "message") {
    li.className = "msgPadrao";
    li.innerHTML = ` (${event.time})<strong>${event.from}</strong>&nbsp; para&nbsp; <strong>${event.to}</strong>:&nbsp; ${event.text}`;
    chatElement.appendChild(li);
  }
}

/*Buscar menssagens*/
window.scrollTo(0, document.body.scrollHeight);
function buscarMsgs() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  console.log("Pedido de msgs enviado");
  promise.then(function (response) {
    console.log(response.data);
    response.data.forEach(function (event) {
      renderizarMenssagem(event);
    });
    window.scrollTo(0, document.body.scrollHeight);
  });
  promise.catch("deuErrado");
}

function dadosChegaram(respostaMsgs) {
  console.log(respostaMsgs);
  renderizarConversas(respostaMsgs.data);
}

function postConnection() {
  const primise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/status",
    { name: nomeNovoUsuario }
  );
  primise.then(console.log);
  primise.catch(console.log);
}

function keepConnection() {
  if (nomeNovoUsuario) {
    setInterval(function () {
      postConnection();
    }, 5000);
  }
}

function keepMsgUpdated() {
  if (nomeNovoUsuario) {
    console.log("keepMsgUpdated");
    setInterval(function () {
      buscarMsgs();
    }, 3000);
  }
}

function enviarMsg() {
  const inputMsg = document.getElementById("input-msg");
  const msg = inputMsg.value;
  const primise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    {
      from: nomeNovoUsuario,
      to: "Todos",
      text: msg,
      type: "message", // ou "private_message" para o bônus
    }
  );
  primise.then(console.log);
  primise.catch(console.log);

  inputMsg.value = "";
}
