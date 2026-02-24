import React, { useState } from 'react';
import { Monitor, Wifi, Clock, Settings, Users, Shield, ChevronRight, Circle } from 'lucide-react';

const   AnyDeskDashboard = ()=> {
  const [activeTab, setActiveTab] = useState('remote');
  const [connectionId, setConnectionId] = useState('');
  
  const myAddress = "123 456 789";
  
  const recentSessions = [
    { id: "987 654 321", name: "Bureau Principal", status: "offline", lastSeen: "Il y a 2h" },
    { id: "456 789 123", name: "Laptop Marie", status: "online", lastSeen: "En ligne" },
    { id: "741 852 963", name: "Serveur Dev", status: "offline", lastSeen: "Il y a 1j" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Monitor className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">RemoteDesk</h1>
                <p className="text-sm text-slate-500">Accès à distance sécurisé</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                <Users size={20} className="text-slate-600" />
              </button>
              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                <Settings size={20} className="text-slate-600" />
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm p-2 flex gap-2">
              <button 
                onClick={() => setActiveTab('remote')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'remote' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Bureau à distance
              </button>
              <button 
                onClick={() => setActiveTab('transfer')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'transfer' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
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
                    Ecran de visionnage
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Identifiant distant
                  </label>
                  <input
                    type="text"
                    value={connectionId}
                    onChange={(e) => setConnectionId(e.target.value)}
                    placeholder="123 456 789"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors text-lg tracking-wide"
                  />
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <Wifi size={20} />
                  {activeTab === 'remote' ? 'Se connecter' : 'Démarrer le transfert'}
                </button>
              </div>

              {/* Quick Options */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 border-2 border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all text-sm font-medium text-slate-700">
                    Mode affichage seul
                  </button>
                  <button className="p-3 border-2 border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all text-sm font-medium text-slate-700">
                    Contrôle total
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Sessions récentes</h3>
                <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                  Tout effacer
                </button>
              </div>

              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-4 border-2 border-slate-100 rounded-xl hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                        <Monitor size={20} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{session.name}</p>
                        <p className="text-sm text-slate-500">{session.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Circle 
                          size={8} 
                          className={session.status === 'online' ? 'fill-green-500 text-green-500' : 'fill-slate-300 text-slate-300'} 
                        />
                        <span className="text-xs text-slate-500">{session.lastSeen}</span>
                      </div>
                      <ChevronRight size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Your Address */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} />
                <h3 className="font-semibold">Votre adresse</h3>
              </div>
              
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-4">
                <p className="text-3xl font-bold tracking-wide text-center">{myAddress}</p>
              </div>
              
              <p className="text-sm text-red-100 text-center">
                Partagez cet identifiant pour permettre l'accès à votre poste
              </p>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">État du système</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Wifi size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Connexion</p>
                      <p className="text-xs text-slate-500">Active</p>
                    </div>
                  </div>
                  <Circle size={8} className="fill-green-500 text-green-500" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Sécurité</p>
                      <p className="text-xs text-slate-500">TLS 1.3</p>
                    </div>
                  </div>
                  <Circle size={8} className="fill-green-500 text-green-500" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Uptime</p>
                      <p className="text-xs text-slate-500">5h 32min</p>
                    </div>
                  </div>
                  <Circle size={8} className="fill-green-500 text-green-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">Actions rapides</h3>
              
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                  📋 Historique des connexions
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                  🔐 Paramètres de sécurité
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                  🎨 Personnalisation
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                  📊 Statistiques
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AnyDeskDashboard