const socket = io();

const chatContainer = document.querySelector("#chat")
const chatInput = document.querySelector("#chatInput")
const chatButton = document.querySelector("#chatButton")

const user = {
    username: ""
}

Swal.fire({
    input:'text',
    title: 'Logueate',
    text: 'Necesitas un nombre para identificarte en el chat!',
    allowOutsideClick: false,
    inputValidator: (value) => {
        // validacion de caracteres.
        if(!value) return 'Por favor ingrese un nick!'
    }
}).then((response) => {
    user.username = response.value
    socket.emit('nueva-conexion',user.username)
})

chatButton.addEventListener("click", () => {
    if(!chatInput.value.trim()) return
    socket.emit("mensaje", {username: user.username, mensaje: chatInput.value})
    chatInput.value = ""
})

socket.on("saludo", (data) => {
    console.log(`El servidor envio esto a traves de Socket -> ${data}`);
})

socket.on("chat-logs", (data) => {
    chatContainer.innerHTML = ""

    data.forEach(({ username, mensaje }) => {
        const divMessage = document.createElement("div")
        divMessage.classList.add("userMessage")
        const pUser = document.createElement("p")
        pUser.textContent = username
        pUser.classList.add("username")
        divMessage.appendChild(pUser)
        const p = document.createElement("p")
        p.textContent = mensaje
        p.classList.add("mensaje")
        divMessage.appendChild(p)
        chatContainer.appendChild(divMessage)
    })
})

socket.on("nueva-conexion", (userConectado) => {
    Toastify({
        text: `${userConectado} se ha conectado`,
        duration: 5000,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
})
