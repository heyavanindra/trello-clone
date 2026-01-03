import { io } from "socket.io-client";

import Cookies from "js-cookie";
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  transports: ["websocket"],
  auth: (cb) => {
    cb({ token: Cookies.get("token") });
  },
});

export default socket;
