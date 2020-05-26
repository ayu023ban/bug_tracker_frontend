// import { SOCKET_URL } from "./settings";
// const 

class WebSocketService {
  constructor() {
    this.socketRef = null
    // this.bug_id = 1
  }
  static instance = null;
  callbacks = {};
  // bug_id = 1
  SOCKET_URL = 'ws' + '://' + 'localhost:8000/' + 'bug_reporter/ws/comments/'+3


  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }


  connect(chatUrl) {
    const path = this.SOCKET_URL
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
      // console.log(e)
    setTimeout(this.connect,3000);
    };
    
  }

  disconnect() {
    this.socketRef.close();
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    // console.log(command)
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    // if (command === "messages") {
    //   this.callbacks[command](parsedData.messages);
    // }
    // if (command === "new_message") {
    //   this.callbacks[command](parsedData.message);
    // }
    this.callbacks[command](parsedData)
    // console.log(this.callbacks[command])
  }

  fetchMessages() {
    this.sendMessage({
      command: "fetch_messages",
    });
  }

  newComment(message) {
    this.sendMessage({
      command: "new_message",
      description:message
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