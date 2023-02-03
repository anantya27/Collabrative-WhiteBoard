import React, { useEffect, useState } from 'react'
import Forms from './components/Forms'
import io from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
// import "react-toastify/dist/ReactToastify.min.css";
import { Route, Routes } from 'react-router-dom';
import RoomPage from './pages/RoomPage';

 
const server="http://localhost:5000";
const connectionOptions= {
  "force new connection" : true,
  reconnectionAttempts: "Infinity",
  timeout:10000,
  transport: ["websocket"]
};

/*
VIDEO CODE (NOT WORKING):
// const socket= io(server,connectionOptions);
*/

//MY CODE:
const socket=io(server)
//

const App= ()=> {

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([])

  useEffect(() => {
    
    socket.on("userIsJoined",(data)=>{
      if(data.success){
        
        console.log("userJoined",data.user);
        setUsers(data.users);
      }
      else{
        console.log("userJoined error");
      }
    })

    socket.on("allUsers", (data) =>{
      console.log("allUsers>>>>>>>>>>>>>>>>",data);
      setUsers(data);
    });

    socket.on("userJoinedMessageBroadcasted",(name)=>{
      console.log(`${name} joined the room`);
      // toast.info(`${name} joined the room`);
      
      toast.info(`${name} joined the room`);
    });


  }, [])
  
  

  const uuid= () => {

    let S4=()=>{
      return (( (1+Math.random())*0x10000) | 0 ).toString(16).substring(1);
    }

    return (
      S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4() 
    )

  }


  return (
    <div className='container'>
    <ToastContainer/>
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />}/>
        <Route path="/:roomId" element={<RoomPage user={user} socket={socket} users={users} />}/>
      </Routes>
    </div>
  )
}

export default App