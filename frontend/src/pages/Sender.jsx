import { useEffect, useRef, useState } from "react";
import { Monitor, Wifi, Clock, Settings, Users, Shield, ChevronRight, Circle } from 'lucide-react';
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import  socket  from "../lib/socket";
import { toast, ToastContainer } from "react-toastify";


export default function Sender() {

    const token  = ()=>{
              const token = Cookies.get('authKey');
              return token;
          }

  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const [code, setCode] = useState('');
  const [searchParam] = useSearchParams();
  const email = searchParam.get("email") || '';
    const [loadingInvite, setLoadingInvite] = useState(false);
  

   const [activeTab, setActiveTab] = useState('remote');
  const [connectionId, setConnectionId] = useState('');
  
  const myAddress = "remotedesk.az-companies.com";
   const [isModalOpen, setIsModalOpen] = useState(true);

   useEffect(() => {
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      const pc = pcRef.current;
      if (!pc) return;

      if (data.type === "answer") {
        await pc.setRemoteDescription(data.sdp);
        console.log("✅ Answer reçue côté Sender");
      }

      if (data.type === "ice") {
        await pc.addIceCandidate(data.candidate);
      }
    };
  }, []);



 const shareScreen = async () => {
  // 1️⃣ Capture écran
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: false,
  });

  videoRef.current.srcObject = stream;

  // 2️⃣ PeerConnection
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pcRef.current = pc;

  // 3️⃣ ICE Sender → WebSocket
  pc.onicecandidate = (e) => {
    if (e.candidate) {
      socket.send(JSON.stringify({
        type: "ice",
        candidate: e.candidate
      }));
    }
  };

  // 4️⃣ Ajout des tracks
  stream.getTracks().forEach(track => {
    pc.addTrack(track, stream);
  });

  // 5️⃣ DataChannel
  const dc = pc.createDataChannel("control");
  dc.onopen = () => console.log("🕹️ DataChannel ouvert côté Sender");

  // 6️⃣ Offer → WebSocket
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  socket.send(JSON.stringify({
    type: "offer",
    sdp: pc.localDescription
  }));

  console.log("📤 Offer envoyée au Receiver");
};

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoadingInvite(true);
   const formData = new FormData();
    formData.append('code', code);
    formData.append('email', email);
    
    try {
       const response  = await axios.post(`${import.meta.env.VITE_BASE_URL}/verify-code`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token()}`
        },
      });

      if(response.data.status === 200){
        setIsModalOpen(false);
        setCode('');
        setLoadingInvite(false);
        return;
      }
      if(response.data.status === 400){
        toast.error(response.data.message || "Code invalide");
        setLoadingInvite(false);
        return;
      }
    } catch (error) {
      console.error("Erreur lors de la validation du code :", error);
    }
}
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <ToastContainer/>
        
       {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Section Gauche : Logo et Titre */}
            <div className="flex items-center gap-3">
              {/* Logo : Taille réduite sur mobile */}
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-900 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <Monitor className="text-white w-5 h-5 md:w-6 md:h-6" />
              </div>
              
              <div className="min-w-0">
                <h3 className="text-xl md:text-3xl font-bold text-slate-800 truncate">
                  Remote Desk
                </h3>
                {/* Texte sous-titre caché sur très petits écrans ou réduit */}
                <p className="text-xs md:text-sm text-slate-500 truncate">
                  Accès à distance à votre ordinateur
                </p>
              </div>
            </div>
            
            {/* Section Droite : Actions */}
            <div className="flex items-center justify-end gap-2 md:gap-3 border-t sm:border-none pt-3 sm:pt-0">
              <button className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors group">
                <Users size={20} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-600 sm:hidden">Utilisateurs</span>
              </button>
              
              <button className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-colors group">
                <Settings size={20} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-600 sm:hidden">Paramètres</span>
              </button>
            </div>

          </div>
        </header>

        <div className="grid grid-cols-1  gap-6">
          
          {/* Main Panel */}
          <div className="lg:col-span-3 space-y-6">
                        {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm p-2 flex gap-2">
              <button 
                onClick={() => setActiveTab('remote')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'remote' 
                    ? 'bg-gradient-to-r from-blue-900 to-teal-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Bureau à distance
              </button>
              <button 
                onClick={() => setActiveTab('transfer')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'transfer' 
                    ? 'bg-gradient-to-r from-blue-900 to-teal-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Transfert de fichiers
              </button>
            </div>

            {/* Connection Panel */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  {activeTab === 'remote' ? 'Se connecter à un bureau' : 'Transférer des fichiers'}
                </h2>
                <p className="text-sm text-slate-500">
                   Acces a votre ordinateur a distant
                </p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4 w-full">
                <button 
                  className="w-full max-w-md bg-gradient-to-r from-blue-900 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2" 
                  onClick={shareScreen}
                >
                  Partager l’écran
                </button>

                <div className="flex justify-center w-full">
                  {videoRef && (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="max-w-full h-auto border border-black"
                      style={{ width: "1500px" }} // Note: 1500px est très large, attention au débordement sur petit écran
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
         
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Renseigner le code OPT</h2>
              
              <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Code OPT
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Entrez le code OPT reçu par email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    {/* <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setEmail('');
                      }}
                      className="px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Annuler
                    </button> */}
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-blue-900 to-teal-600
                       text-white rounded-lg hover:bg-blue-700 transition-colors"
                       disabled={loadingInvite}
                    >
                       {loadingInvite ? "Validation en cours..." : "Valider"}
                    </button>
                  </div>
              </form>
              
            </div>
          </div>
        )} 

      </div>
    </div>
  );
}
