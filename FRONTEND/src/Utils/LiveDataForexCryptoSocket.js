
class WebSocketServiceForexCrypto {
    constructor(uri) {
      this.uri = uri;
      this.socket = null;
    }
  
    connect(onMessage, onOpen, onClose, onError) {

      this.socket = new WebSocket(this.uri);
  
      // this.socket.onopen = onOpen;
      this.socket.onopen = () => {
        onOpen(this.socket); // Pass the socket instance to the onOpen handler
      };
      this.socket.onmessage = (event) => onMessage(JSON.parse(event.data));
      this.socket.onerror = onError;
      this.socket.onclose = onClose;

  
      return () => {
        if (this.socket) {
          this.socket.close();
        }
      };
    }
  }
  
  export default WebSocketServiceForexCrypto;