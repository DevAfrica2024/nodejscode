import { useRef, useState } from "react";

export default function Receiver() {
  const videoRef = useRef(null);
  const pcRef = useRef(null);

  const [offerText, setOfferText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [iceText, setIceText] = useState("");

  const receiveScreen = async () => {
    if (!offerText) {
      alert("Collez l’offer d’abord");
      return;
    }

    const localCandidates = [];

   const pc = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
  ],
});


    pcRef.current = pc;

    pc.ontrack = (event) => {
      console.log("Stream reçu");
      videoRef.current.srcObject = event.streams[0];
    };

    pc.ondatachannel = (event) => {
      event.channel.onopen = () =>
        console.log("DataChannel ouvert côté Receiver");
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        localCandidates.push(event.candidate);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("Receiver ICE:", pc.iceConnectionState);
    };

    const parsed = JSON.parse(offerText);

// accepte { offer: {...} } ou {...}
const offer = parsed.offer ? parsed.offer : parsed;

if (!offer.type || !offer.sdp) {
  alert("Offer invalide : type ou sdp manquant");
  return;
}

await pc.setRemoteDescription(new RTCSessionDescription(offer));


    // 2️⃣ Créer l’answer
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // 3️⃣ Attendre les ICE puis afficher answer + ICE
    setTimeout(() => {
      setAnswerText(
        JSON.stringify({
          answer,
          candidates: localCandidates,
        })
      );
    }, 1500);
  };

  const addIceFromSender = async () => {
    if (!pcRef.current) {
      alert("Cliquez d’abord sur « Recevoir l’écran »");
      return;
    }

    const candidates = JSON.parse(iceText);
    for (const c of candidates) {
      await pcRef.current.addIceCandidate(c);
    }

    console.log("ICE du Sender ajoutées");
  };

  return (
    <div>
      <h2>Receiver (voir écran)</h2>

      <h3>Offer du Sender</h3>
      <textarea
        rows={6}
        cols={60}
        value={offerText}
        onChange={(e) => setOfferText(e.target.value)}
      />



      <br />
      <button onClick={receiveScreen}>Recevoir l’écran</button>

      <h3>ICE du Sender</h3>
      <textarea
        rows={6}
        cols={60}
        value={iceText}
        onChange={(e) => setIceText(e.target.value)}
      />
      <br />
      <button onClick={addIceFromSender}>Ajouter ICE</button>

      <h3>Answer + ICE (à renvoyer au Sender)</h3>
      <textarea rows={6} cols={60} value={answerText} readOnly />

      <video
        ref={videoRef}
        autoPlay
        style={{ width: 400, border: "1px solid black", marginTop: 10 }}
      />
    </div>
  );
}
