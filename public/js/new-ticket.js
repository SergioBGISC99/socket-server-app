const labelElement = document.querySelector("span");
const buttonElement = document.querySelector("button");

async function getLastTicket() {
  const lastTicket = await fetch("/api/ticket/last").then((resp) =>
    resp.json()
  );
  labelElement.innerHTML = lastTicket;
}

async function createNewTicket() {
  const newTicket = await fetch("/api/ticket", {
    method: "POST",
  }).then((resp) => resp.json());

  labelElement.innerHTML = newTicket.number;
}

buttonElement.addEventListener("click", createNewTicket);

getLastTicket();
