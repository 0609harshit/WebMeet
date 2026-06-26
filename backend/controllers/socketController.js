import { Server } from 'socket.io';

export default function connectToSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "https://webmeet-frontend.onrender.com"
        }
    });

    io.on("connection", (socket) => {
        console.log(`${socket.id} connected`);

        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            const clients =
                [...io.sockets.adapter.rooms.get(roomId) || []];

            socket.emit(
                "existing-users",
                clients.filter(id => id !== socket.id)
            );
            socket.to(roomId).emit('user-joined', socket.id);
            console.log(`${socket.id} joined ${roomId}`)

        })

        socket.on('send-message', (data) => {

            console.log("Message received")
            socket.to(data.roomId).emit('receive-message', data.message);
            console.log("Messag sent");
        })
        socket.on(
            "offer",
            ({ target, offer }) => {

                io.to(target).emit(
                    "offer",
                    {
                        sender: socket.id,
                        offer
                    }
                );

            }
        );

        socket.on(
            "answer",
            (data) => {

                io.to(data.targetUserId)
                    .emit(
                        "answer",
                        {
                            senderId : socket.id,
                            answer : data.answer
                        }
                    );

            }
        );

        socket.on(
            "ice-candidate",
            (data) => {

                io.to(data.targetUserId)
                    .emit(
                        "ice-candidate",
                        {
                            senderId: socket.id,
                            candidate: data.candidate
                        }
                    );

            }
        );
    })
}