const lblPending = document.querySelector("#lbl-pending");
const deskHeader = document.querySelector("h1");
const ticketAlert = document.querySelector(".alert");
const drawBtn = document.querySelector("#btn-draw");
const doneBtn = document.querySelector("#btn-done");
const currentTicketLabel = document.querySelector("small");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("Escritorio es requerido");
}

const deskNumber = searchParams.get("escritorio");
let workingTicket = null;
deskHeader.innerHTML = deskNumber;

function checkTicketCount(currentCount = 0) {
  if (currentCount === 0) {
    ticketAlert.classList.remove("d-none");
  } else {
    ticketAlert.classList.add("d-none");
  }

  lblPending.innerHTML = currentCount;
}

async function loadInitialCount() {
  const pending = await fetch("/api/ticket/pending").then((resp) =>
    resp.json()
  );

  checkTicketCount(pending.length);
}

function connectToWebSockets() {
  const socket = new WebSocket("ws://localhost:3000/ws");

  socket.onmessage = (event) => {
    const { payload, type } = JSON.parse(event.data);
    if (type !== "on-ticket-number-changed") return;
    checkTicketCount(payload);
  };

  socket.onclose = (event) => {
    console.log("Connection closed");
    setTimeout(() => {
      console.log("retrying to connect");
      connectToWebSockets();
    }, 1500);
  };

  socket.onopen = (event) => {
    console.log("Connected");
  };
}

async function getTicket() {
  await doneTicket();

  const { status, ticket } = await fetch(`api/ticket/draw/${deskNumber}`).then(
    (resp) => resp.json()
  );

  if (status === "error") {
    currentTicketLabel.innerHTML = message;
    return;
  }

  workingTicket = ticket;
  currentTicketLabel.innerText = ticket.number;
}

async function doneTicket() {
  if (!workingTicket) return;

  const { status, message } = await fetch(
    `api/ticket/done/${workingTicket.id}`,
    {
      method: "PUT",
    }
  ).then((resp) => resp.json());

  if (status === "ok") {
    workingTicket = null;
    currentTicketLabel.innerHTML = "Nadie";
  }
}

drawBtn.addEventListener("click", getTicket);
doneBtn.addEventListener("click", doneTicket);

connectToWebSockets();
loadInitialCount();
