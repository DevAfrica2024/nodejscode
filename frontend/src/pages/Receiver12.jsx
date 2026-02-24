import { useRef, useEffect, useState } from "react";
import socket from "../lib/socket";

export default function Receiver() {
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    pc.ontrack = (e) => {
      const video = videoRef.current;
      if (video.srcObject !== e.streams[0]) {
        video.srcObject = e.streams[0];
      }

        // 🔹 Lecture forcée en gérant l'autoplay
        const playVideo = async () => {
          try {
            if (canPlay) {
              video.play().catch(() => {});
            }

            console.log("🎥 Video track attachée et lecture démarrée");
          } catch (err) {
            console.warn("⚠️ Lecture vidéo bloquée par le navigateur", err);
          }
        };

        // 🔹 On attend la prochaine frame pour être sûr que le DOM est prêt
        requestAnimationFrame(playVideo);

        console.log("Track kind:", e.track.kind);
        console.log("Track settings:", e.track.getSettings());
};


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

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "offer") {
        console.log("📩 Offer reçue");

        await pc.setRemoteDescription(data.sdp);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.send(
          JSON.stringify({
            type: "answer",
            sdp: answer,
          })
        );

        console.log("📤 Answer envoyée");
      }

      if (data.type === "ice") {
        await pc.addIceCandidate(data.candidate);
      }
    };

    return () => pc.close();
  }, []);

  return (
     <div>
    {!canPlay && <button onClick={() => setCanPlay(true)}>Voir l’écran</button>}
    <video
      ref={videoRef}
      autoPlay
      playsInline
      style={{ width: 400, border: "1px solid black" }}
    />
  </div>
  );
}
