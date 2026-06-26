import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { io } from 'socket.io-client'



export default function Meet() {

    const { meetCode } = useParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const localStream = useRef(null);
    const localVideo = useRef(null);

    const socket = useRef(null);

    const [remoteStreams, setRemoteStreams] = useState([]);

    const peers = useRef({});

    useEffect(() => {

        let stream;

        async function startLocalMedia() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                localStream.current = stream;
                localVideo.current.srcObject = stream;


            }
            catch (err) {
                console.log(err)
            }
        }


        async function initialise() {
            socket.current = io(import.meta.env.VITE_BACKEND_URL);

            await startLocalMedia();

            socket.current.emit('join-room', meetCode);

            console.log("Everything fine")
        }
        initialise();

        socket.current.on('receive-message', (data) => {

            setMessages(prev => [...prev, data]);
            console.log("Message received")

        })
        const createPeer = (userId) => {

            console.log(`peerConnection creating for ${userId}`)

            const peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.l.google.com:19302"
                    }
                ]
            });

            peers.current[userId] = peer;

            peer.ontrack = (event) => {

                setRemoteStreams(prev => {

                    const exists = prev.find(
                        stream =>
                            stream.userId === userId
                    );

                    if (exists) return prev;

                    return [
                        ...prev,
                        {
                            userId,
                            stream:
                                event.streams[0]
                        }
                    ];

                });

            };
            peer.onicecandidate = (event) => {

                if (event.candidate) {

                    socket.current.emit(
                        "ice-candidate",
                        {
                            targetUserId: userId,
                            candidate: event.candidate
                        }
                    );

                }

            };

            return peer;
        };



        socket.current.on(
            "ice-candidate",
            async ({ senderId, candidate }) => {

                const peer = peers.current[senderId];
                if (peer) {
                    try {

                        await peers.current[senderId].addIceCandidate(
                            candidate
                        );

                    }
                    catch (err) {

                        console.log(err);

                    }
                }

            }
        );



        socket.current.on(
            "existing-users",
            async (users) => {

                for (const userId of users) {

                    const peer =
                        createPeer(userId);

                    localStream.current.getTracks().forEach(track => {
                        peer.addTrack(track, localStream.current);
                    });

                    const offer =
                        await peer.createOffer();

                    await peer.setLocalDescription(
                        offer
                    );

                    socket.current.emit(
                        "offer",
                        {
                            target: userId,
                            offer
                        }
                    );

                }

            }
        );
        socket.current.on(
            "user-joined",
            (userId) => {

                createPeer(userId);

            }
        );
        socket.current.on(
            "answer",
            async ({ senderId, answer }) => {

                await peers.current[senderId]
                    .setRemoteDescription(answer);

            }
        );

        socket.current.on(
            "offer",
            async ({ sender, offer }) => {

                let peer =
                    peers.current[sender];

                if (!peer) {

                    peer =
                        createPeer(sender);

                }

                localStream.current.getTracks().forEach(track => {
                    peer.addTrack(track, localStream.current);
                });

                await peer
                    .setRemoteDescription(offer);

                const answer =
                    await peer.createAnswer();

                await peer
                    .setLocalDescription(answer);

                socket.current.emit(
                    "answer",
                    {
                        targetUserId: sender,
                        answer
                    }
                );

            }
        );

        return () => {
            stream?.getTracks().forEach(track => {
                track.stop();
            });

            Object.values(
                peers.current
            ).forEach(peer => {

                peer.close();

            });

            socket.current.removeAllListeners();
            socket.current.disconnect();
        };

    }, [meetCode])

    const sendMessage = () => {

        if (message.trim() === "") return;

        const data = {
            roomId: meetCode,
            message: message
        }

        socket.current.emit('send-message', data);
        console.log("Messag sent");

        setMessages(prev => [

            ...prev,
            data.message


        ]);



        setMessage("");


    }

    return (
        <>
            <div className="meet-container">
                <div className="meet-code">
                    <h5 id="meet-code-output"> Meet Code : {meetCode}</h5>
                </div>
                <div className="meet-pannel">
                    <div className="meet-frame">
                        <div className="other-meet-frame">
                            {
                                remoteStreams.map(user => (

                                    <div key={user.userId} className="remote-meet-frames">
                                        <video
                                            autoPlay
                                            playsInline
                                            ref={(video) => {

                                                if (video) {

                                                    video.srcObject =
                                                        user.stream;

                                                }

                                            }}
                                        />
                                    </div>

                                ))
                            }
                        </div>
                        <div className="my-meet-frame">
                            <video ref={localVideo} autoPlay muted playsInline></video>
                        </div>
                    </div>
                    <div className="meet-chat-frame">
                        <div className="chat-div">
                            {
                                messages.map((msg, index) => (
                                    <p key={index} >{msg}</p>
                                ))
                            }
                        </div>
                        <div className="chat-msg">
                            <input type="text" value={message} id="chat-message" placeholder="Enter message" onChange={(e) => { setMessage(e.target.value) }} />
                            <button onClick={() => {
                                sendMessage();
                                setMessage("");
                            }} >Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}