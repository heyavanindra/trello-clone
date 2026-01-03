import { io } from "socket.io-client";

import Cookies from "js-cookie";
const socket = io("http://localhost:5000" ,{
    auth:{
        token:Cookies.get("token")
    },
}); 



export default socket;
