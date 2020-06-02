// import { SOCKET_URL } from "./settings";
// const 

class WebSocketService {
  constructor() {
    this.socketRef = null
    this.connect = this.connect.bind(this)
  }
  static instance = null;
  callbacks = {};


  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }


  connect(chatUrl) {
    const path = chatUrl
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = (e) => {
      console.log("WebSocket closed let's reopen");
      this.connect(path)
    };

  }

  // disconnect() {
  //   this.socketRef.close();
  // }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === "messages" || command === "new_message") {
      this.callbacks[command](parsedData)
    }
    else { console.log(parsedData) }

  }

  fetchMessages() {
    this.sendMessage({
      command: "fetch_messages",
    });
  }

  newComment(message) {
    this.sendMessage({
      command: "new_message",
      description: message
    })
  }

  addCallbacks(messagesCallback, newMessageCallback) {
    this.callbacks["messages"] = messagesCallback;
    this.callbacks["new_message"] = newMessageCallback;
  }

  sendMessage(data) {
    data.token = sessionStorage.getItem("token")
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err)
      console.log(err.message);
    }
  }

  state() {
    return this.socketRef.readyState;
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;