import socket from "socket.io-client"; 
let socketInstance = null; 
/**
 * Initializes the socket connection if it hasn't been initialized yet.
 * It uses the base URL from the environment variables and authenticates
 * using a token stored in local storage.
 * @returns The instance of the socket connection.
 */
export const initilizeSocket = (projectId) => {
  if (!socketInstance) {
    socketInstance = socket(import.meta.env.VITE_BASE_URL, {
      auth: {
        token: localStorage.getItem("token"),
    
      },
      query:{projectId}

    });
  }
  return socketInstance;
};
/**
 * Emits a message to the server on a specified event name with the provided data.
 * This function checks if the socket instance is initialized before emitting the message.
 * @param {string} eventName - The name of the event to emit.
 * @param {*} data - The data to be sent with the event.
 */
export const sendMessage = (eventName,data) => {
  if (socketInstance) {
    socketInstance.emit(eventName,data);
  }
};
/**
 * Listens for incoming messages on a specified event name and calls the callback function.
 * This function checks if the socket instance is initialized before setting up the listener.
 * @param {string} eventName - The name of the event to listen for.
 * @param {function} cb - The callback function to be called when the event is received.
 */
export const receiveMessage = (eventName,cb) => {
  if (socketInstance) {
    socketInstance.on(eventName,cb);
  }
};

