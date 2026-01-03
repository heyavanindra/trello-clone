import { io } from "socket.io-client";

import Cookies from "js-cookie";
const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
    auth:{
        token:Cookies.get("token")
    },
}); 



export default socket;
