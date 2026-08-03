let io;


const initializeSocket = (server)=>{

    io = require("socket.io")(server,{
        cors:{
            origin:"http://localhost:5173"
        }
    });


    io.on("connection",(socket)=>{

        console.log(
            "User connected:",
            socket.id
        );


        socket.on(
            "joinRoom",
            (userId)=>{

                socket.join(userId);

            }
        );


    });

};


const sendNotification = (
    userId,
    message
)=>{

    if(io){

        io.to(userId)
        .emit(
            "notification",
            message
        );

    }

};


module.exports={
    initializeSocket,
    sendNotification
};