import { useRef, useState } from "react";

export default function Sender() {
  const videoRef = useRef(null);
  const pcRef = useRef(null);

  const [offer, setOffer] = useState("");
  const [answer, setAnswer] = useState("");
  const [iceCandidates, setIceCandidates] = useState([]);

  const shareScreen = async () => {
    // 1️⃣ Capture écran
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    videoRef.current.srcObject = stream;

    // 2️⃣ PeerConnection
  const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });


    pcRef.current = pc;
    // 3️⃣ ICE
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        setIceCandidates((prev) => [...prev, event.candidate]);
      }
    };

    // 4️⃣ Ajout du stream
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // 5️⃣ DataChannel
    const dc = pc.createDataChannel("control");
    dc.onopen = () => console.log("DataChannel ouvert côté Sender");

    // 6️⃣ Offer (CORRECT)
    await pc.setLocalDescription(await pc.createOffer());

    // ⚠️ TOUJOURS localDescription
    setOffer(JSON.stringify(pc.localDescription));
  };

  // 7️⃣ Appliquer answer + ICE Receiver
  const handleAnswer = async () => {
    const pc = pcRef.current;
    if (!pc || !answer) return;

    const parsed = JSON.parse(answer);

    await pc.setRemoteDescription(parsed.answer);

    for (const c of parsed.candidates) {
      await pc.addIceCandidate(c);
    }

    console.log("Connexion WebRTC établie 🎉");
  };

  return (
    <div>
      <h2>Sender (partage écran)</h2>

      <button onClick={shareScreen}>Partager l’écran</button>

      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: 400, border: "1px solid black" }}
      />

      <h3>Offer (à envoyer au Receiver)</h3>
      <textarea rows={6} cols={60} value={offer} readOnly />

      <h3>ICE Candidates (Sender)</h3>
      <textarea
        rows={6}
        cols={60}
        value={JSON.stringify(iceCandidates)}
        readOnly
      />

      <h3>Coller l’answer du Receiver</h3>
      <textarea
        rows={6}
        cols={60}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button onClick={handleAnswer}>Appliquer l’answer</button>
    </div>
  );
}
