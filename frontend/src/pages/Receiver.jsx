import { useRef, useEffect, useState } from "react";
import  socket  from "../lib/socket";
import { Monitor, Settings, Users, Shield } from "lucide-react";



export default function Receiver() {
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  

  const [activeTab, setActiveTab] = useState("remote");
  const myAddress = "remotedesk.az-companies.com";

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current = pc;

    // 📺 Réception vidéo
    pc.ontrack = (event) => {
      console.log("📺 Track reçue:", event.streams);
      videoRef.current.srcObject = event.streams[0];

      // Fix autoplay
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        console.warn("⚠️ Autoplay bloqué");
      });
    };

    // 🧊 ICE Receiver → Sender
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.send(JSON.stringify({
          type: "ice",
          candidate: e.candidate,
        }));
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("Receiver connection:", pc.connectionState);
    };

    pc.oniceconnectionstatechange = () => {
      console.log("Receiver ICE:", pc.iceConnectionState);
    };

    // 📩 Messages WebSocket
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      // 🔹 OFFER reçue
      if (data.type === "offer") {
        console.log("📩 Offer reçue");

        await pc.setRemoteDescription(data.sdp);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.send(JSON.stringify({
          type: "answer",
          sdp: pc.localDescription,
        }));

        console.log("📤 Answer envoyée");
      }

      // 🔹 ICE du Sender
      if (data.type === "ice") {
        await pc.addIceCandidate(data.candidate);
      }
    };

    return () => pc.close();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
       

        {/* Main */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold mb-4">
            Bureau distant
          </h2>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              border: "1px solid black",
              borderRadius: 8,
            }}
          />
        </div>

        {/* Sidebar */}
        {/* <div className="mt-6 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield size={20} />
            <h3 className="font-semibold">Vous a present sur:</h3>
          </div>
          <p className="text-center font-bold">AZ-REMOTEDESK</p>
        </div> */}

      </div>
    </div>
  );
}

