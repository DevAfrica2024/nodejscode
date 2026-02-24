const socket = new WebSocket('wss://remote.az-companies.com');

socket.onopen = () => {
  console.log("🟢 WebSocket connecté");
};

socket.onerror = (e) => {
  console.error("🔴 WebSocket error", e);
};

export default socket;
