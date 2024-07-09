
class WebSocketService {
    constructor(uri) {
      this.uri = uri;
      this.socket = null;
    }
  
    connect(onMessage, onOpen, onClose, onError) {
      this.socket = new WebSocket(this.uri);
  
      this.socket.onopen = onOpen;
      this.socket.onmessage = (event) => onMessage(JSON.parse(event.data));
      this.socket.onerror = onError;
      this.socket.onclose = onClose;
    //   this.socket.onclose = () => {
    //     if (onClose) onClose();
    //     setTimeout(() => this.connect(onMessage, onOpen, onClose, onError), 15000);
    //   };
  
      return () => {
        if (this.socket) {
          this.socket.close();
        }
      };
    }
  }
  
  export default WebSocketService;