// js/web/chatSocket.js
import { addMessage, addSystemMessage, updateUserList } from "../ui/chatUI.js";

let socket;

export function connect(user) {
  const wsUrl = location.hostname === "localhost" ? "ws://localhost:3000" : `wss://${location.host}`;
  socket = new WebSocket(wsUrl);

  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({ type: "login", user }));
  });

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "chat":
          // data: { type: "chat", user: "Remitente", to: "Destinatario", text: "..." }
          // isSelf -> true si el remitente es el usuario local (comprobado por server-side, aquí suponemos que `user` es el que se pasó a connect)
          // NOTA: el "user" local se conoce dentro de connect a través del closure 'user'
          addMessage(data.user, data.text, data.user === user.name, data.to);
          break;
        case "system":
          addSystemMessage(data.text);
          break;
        case "users":
          updateUserList(data.users || []);
          break;
        default:
          console.warn("Tipo mensaje desconocido:", data.type);
      }
    } catch (err) {
      console.error("Error parseando mensaje WS:", err, event.data);
    }
  });

  socket.addEventListener("close", () => {
    addSystemMessage("Conexión cerrada");
  });

  socket.addEventListener("error", () => {
    addSystemMessage("Error en la conexión WebSocket");
  });
}

export function sendMessage(userName, text, to) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({
    type: "chat",
    user: userName,
    to,
    text
  }));
}
