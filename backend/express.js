const express = require('express');
require('dotenv').config();
const chats= require('./Data/data.js');
const subjects=require('./Data/Subjects.js');
const userRoutes=require('./Routes/userRoutes');
const chatRoutes=require('./Routes/chatRoutes');
const messageRoutes=require('./Routes/messageRoutes');
const projectRoutes=require('./Routes/projectRoutes');
const alumniRoutes=require('./Routes/alumniRoutes');
const AcademicRoutes=require('./Routes/AcademicRoutes')
const mongoDB=require('./config/db');
const app = express();
const cors=require('cors');
mongoDB();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
const port= process.env.PORT;
const server = app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
app.get('/',(req,res)=>{
    res.send("API success");
});
app.use('/api/academics',AcademicRoutes);
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/messages',messageRoutes);
app.use('/api/research', projectRoutes);
app.use('/api/alumni', alumniRoutes)
app.get("/api/chat/:id",(req,res)=>{
    // console.log(req.params.id);
    const singleChat=chats.find((c)=>c._id ===req.params.id);
    res.send(singleChat);
})

app.get("/subjects",(req,res)=>{
    res.send(subjects);
});

const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
    },
});

io.on('connection',(socket)=>{
    console.log("Socket connected");
    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        socket.emit('connected');
    });
    socket.on('join room',(room)=>{
        socket.join(room);
        console.log("Joined room" + room);
    });
    socket.on('typing',(room)=>{
        socket.in(room).emit("typing");
    }); 
    socket.on('stop typing',(room)=>{
        socket.in(room).emit("stop typing");
    });
    socket.on('new msg',(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        if(!chat.users){
            return console.log("users not defined");
        }
        chat.users.forEach(user =>{
            if(user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved",newMessageRecieved);
        })
        // socket.off("user left",()=>{
        //     console.log("user left");
        //     socket.leave(chat._id);
        // });
    })
})
