import { io } from "socket.io-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const socket = io(apiUrl);

export default socket;
