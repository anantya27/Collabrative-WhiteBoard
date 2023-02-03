const express = require('express');
const { addUser } = require('./utils/users');
const app = express();

const server=require('http').createServer(app);
/*
VIDEO CODE (NOT WORKING):
// const {Server} = require('socket.io');
// const io=new Server(server);
*/

const io = require('socket.io')(server, {
    cors: { origin: "*" }
});


app.get("/",(req,res)=>{
    res.send("Board Sharing app");
});
 
let roomIdGlobal,imgURLGlobal;

io.on("connection",(socket)=>{
    
    socket.on("userJoined",(data)=>{
        const {name,userId,roomId,host,presenter}=data;
        roomIdGlobal=roomId;
        // console.log(">>>>>>>>>>>>",roomId,"   ",roomIdGlobal);
        socket.join(roomId);
        const users = addUser(data);
        socket.emit("userIsJoined",{success: true,users:users});
        socket.to(roomId).emit("userJoinedMessageBroadcasted",name);
        socket.to(roomId).emit("allUsers",users);
        socket.to(roomId).emit("whiteBoardDataResponse",{
            imgURL:imgURLGlobal
        });
    });
    
    socket.on("whiteboardData",(data)=>{
        imgURLGlobal=data;
        // console.log("whiteboardData>>>",roomIdGlobal);
        socket.to(roomIdGlobal).emit("whiteBoardDataResponse",{
            imgURL:data
        });
    })

});

const port=process.env.PORT || 5000;
server.listen(port,()=>{
    console.log(`server is running at port ${port}`);
});    