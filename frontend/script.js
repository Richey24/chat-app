const socket = io("http://localhost:5000", { autoConnect: false });
const left = document.getElementById("left");
const heading = document.getElementById("heading");
const message = document.getElementById("message");

const myForm = document.getElementById("form");
myForm !== null && (myForm.onsubmit = submit);

async function submit(event) {
  event.preventDefault();
  const user = {
    username: event.target.username.value,
    password: event.target.password.value,
  };
  const rep = await fetch("https://dreamtechhotel.herokuapp.com/user/login", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const res = await rep.json();
  localStorage.setItem("userId", res._id);
  localStorage.setItem("username", res.username);
  if (res.role === "Customer") {
    window.location.href = "http://127.0.0.1:5500/frontend/customer.html";
  } else {
    window.location.href = "http://127.0.0.1:5500/frontend/admin.html";
  }
  console.log(res);
}

function connect() {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "http://127.0.0.1:5500/frontend/login.html";
  }
  socket.connect();
}

function check() {
  let userId = localStorage.getItem("userId");
  if (userId) {
    window.location.href = "http://127.0.0.1:5500/frontend/customer.html";
  }
}

socket.on("connect", () => {
  let userId = localStorage.getItem("userId");
  let username = localStorage.getItem("username");
  console.log(userId, username);
  socket.emit("join-room", userId);
  heading.innerHTML = `Welcome ${username} to the best hotel in the city, Feel free to request for any services`;
});

socket.on("message", (message) => {
  const recievedMessage = document.createElement("p");
  const container = document.createElement("div");
  recievedMessage.innerHTML = message;
  recievedMessage.className = "left";
  container.innerHTML = recievedMessage.outerHTML;
  container.className = "recievedDiv";
  if (left.lastElementChild?.className === "recievedDiv") {
    left.lastElementChild.appendChild(recievedMessage);
    return;
  }
  left.appendChild(container);
});

function send() {
  if (message.value === "") return;
  let userId = localStorage.getItem("userId");
  socket.emit("newMessage", message.value, userId);
  const yourMessage = document.createElement("p");
  const container = document.createElement("div");
  yourMessage.innerHTML = message.value;
  yourMessage.className = "right";
  container.innerHTML = yourMessage.outerHTML;
  container.className = "sendDiv";
  if (left.lastElementChild?.className === "sendDiv") {
    left.lastElementChild.appendChild(yourMessage);
    message.value = "";
    return;
  }
  message.value = "";
  left.appendChild(container);
}
