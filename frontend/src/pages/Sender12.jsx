import { useRef, useEffect } from "react";
import socket from "../lib/socket";

export default function Sender() {
  const videoRef = useRef(null);
  const pcRef = useRef(null);

  const start = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    videoRef.current.srcObject = stream;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.send(
          JSON.stringify({
            type: "ice",
            candidate: e.candidate,
          })
        );
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.send(
      JSON.stringify({
        type: "offer",
        sdp: offer,
      })
    );

    console.log("📤 Offer envoyée");
  };

  useEffect(() => {
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      const pc = pcRef.current;
      if (!pc) return;

      if (data.type === "answer") {
        await pc.setRemoteDescription(data.sdp);
        console.log("📥 Answer reçue");
      }

      if (data.type === "ice") {
        await pc.addIceCandidate(data.candidate);
      }
    };
  }, []);

  return (
    <>
      <button onClick={start}>Partager écran</button>
      <video ref={videoRef} autoPlay muted style={{ width: 400 }} />
    </>
  );
}
