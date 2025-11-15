import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.MODE === 'production' ? undefined : `http://${import.meta.env.VITE_IP}:5000`;

export const socket = io(URL, {
  transports: ["websocket"], // force websocket, skip long-polling
});