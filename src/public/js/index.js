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

const sendMessage = () => {
    if(!chatInput.value.trim()) return
    socket.emit("mensaje", {username: user.username, mensaje: chatInput.value})
    chatInput.value = ""
}

chatButton.addEventListener("click", sendMessage)

chatInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return
    event.preventDefault()
    sendMessage()
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
        duration: 3500,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        close: false,
        offset: {
            x: 20,
            y: 20
        },
        style: {
          background: "#fffaf6",
          color: "#3a2a25",
          border: "1px solid rgba(201, 108, 78, 0.18)",
          boxShadow: "0 12px 30px rgba(69, 34, 27, 0.14)",
          borderRadius: "14px",
          padding: "0.9rem 1rem",
          fontFamily: "\"Space Grotesk\", \"Trebuchet MS\", sans-serif",
          fontSize: "0.95rem",
          maxWidth: "320px",
          marginLeft: "1rem"
        },
        className: "chat-toast",
      }).showToast();
})
