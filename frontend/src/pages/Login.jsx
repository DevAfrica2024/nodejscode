import az from '../assets/img/icon.png';
import ad from '../assets/img/ad.png'
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { ArrowLeft, BarChart, Building, Eye, EyeOff, Facebook, FileText, Folder, Hash, Heart, Instagram, Laptop, LaptopIcon, Linkedin, ListChecks, Lock, Mail, MailCheck, MessageCircle, MessagesSquare, Monitor, Share2, Shield, Users, Youtube, Zap } from 'lucide-react';
import React from 'react';
import { useAuth } from '../contexts/authContext';
import axios from 'axios';
import Cookies from "js-cookie";
import { encryptData } from '../utils/crypto';
import { useNavigate } from 'react-router-dom';



const Login = ()=>{

     const token  = ()=>{
        const token = Cookies.get('authKey');
        return token;
    }

     const navigate = useNavigate();
     const [step, setStep] = useState('welcome');
     const [loginMethod, setLoginMethod] = useState('email');
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [showPassword, setShowPassword] = useState(false);
     const [code, setCode] = useState(['', '', '', '']);
     const [loading, setLoading] = useState(false);
    // const [companies, setCompanies] = useState({ customers: [] });
     const inputRefs = React.useRef([]);
     const { signIn, setCompanies, companies,updateToken,user, setUser } = useAuth();

     const handleSubmit = async (e) => {
      //setLoading(true);
       e.preventDefault();
      const res =  await signIn(email, code, password, loginMethod);
      if(res.error){
        toast.error(res.error);
        setLoading(false);
        return ;
      }
       setStep('company');
     };


     const handleChoose = async (company) => {
        try {
            // Vérifie que le token existe
            const authToken = token(); // token() doit retourner le JWT
            if (!authToken) {
            console.error("Token non disponible");
            return;
            }

            // Si companies est un tableau, il faut récupérer l'utilisateur d'une autre source
           // const userId = localStorage.getItem("user_id"); // ou depuis le context/state

            const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/auth/select-company`,
            {
                company_id: company.company_number,
                user_id: user?.Customers_Numbers
            },
            {
                headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json"
                }
            }
            );

            if(res.data.status){
            updateToken (res.data.access_token);
            localStorage.setItem('selected_company', encryptData(company));
            ///localStorage.setItem('data', JSON.stringify(res.data.data));
            navigate('/dashboard');
            }

            //console.log("Response from select-company:", res.data);

        } catch (error) {
            console.error("Erreur lors de la sélection de l'entreprise :", error.response?.data || error.message);
        }
        };

      //  console.log('Companies disponibles:', companies);


   return (
       <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      {/* Main Card Container */}
       <ToastContainer/>
      <div className="w-full" style={{maxWidth: '800px'}}>
        <div className="bg-white shadow-lg border-2 border-gray-300 rounded-2xl overflow-hidden">
        
           <div className="bg-gradient-to-r from-blue-900 to-teal-600 text-white py-4 px-4 text-center rounded-t-2xl" >
                <div className="flex justify-center mb-3">
                  <div className="bg-white/25 p-2 rounded-full">
                    <LaptopIcon size={60} className="text-white" />
                    {/* <img src="" alt="Logo" style={{height: '80px',width: '80px',borderRadius: '50%', objectFit: 'contain'}} /> */}
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1">AZ RD</h2>
                <p className="text-white/50 text-sm">Acces a distance d'un ordinateur</p>
                
                {/* Steps Indicator */}
                <div className="flex items-center justify-center mt-4 gap-3">
                     <div className="flex items-center justify-center mt-8 space-x-4">
                    <div className="flex items-center">
                    <div className="bg-white text-teal-600 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        1
                    </div>
                    <span className="ml-2 text-sm">Bienvenue</span>
                    </div>
                    <div className="w-16 h-0.5 bg-white/40"></div>
                    <div className="flex items-center">
                    <div className="bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        2
                    </div>
                    <span className="ml-2 text-sm">Se connecter</span>
                    </div>
                </div>
                </div>
           </div>

            {/* Content Section */}
            <div className="p-0">
              {step === 'welcome' ? (
                // ÉTAPE 1: ACCUEIL
                <div className="p-4 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Découvrez AZ-RD
                  </h2>
                  <p className="text-gray-600 text-center mb-4 text-sm">
                    Accédez aux principales fonctionnalités pour la gestion de vos sessions de contrôle à distance.
                  </p>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">

                   <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border-2 border-teal-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start">
                      <div className="bg-teal-500 p-3 rounded-xl">
                        <Laptop className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Contrôle à Distance</h3>
                        <p className="text-slate-600">
                          Prenez le contrôle de vos PC à distance facilement et en toute sécurité
                        </p>
                      </div>
                    </div>
                  </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start">
                        <div className="bg-blue-500 p-3 rounded-xl">
                          <ListChecks className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">Gestion des Sessions</h3>
                          <p className="text-slate-600">
                            Organisez et priorisez vos sessions de contrôle efficacement
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start">
                        <div className="bg-purple-500 p-3 rounded-xl">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">Gestion d'Équipe</h3>
                          <p className="text-slate-600">
                            Gérez vos équipes et collaborateurs pour un support optimal
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <button
                    onClick={() => setStep('login')}
                    className="w-full text-white py-3 rounded-2xl font-semibold shadow-lg text-sm bg-gradient-to-r from-blue-900 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all"
                  >
                    → Se connecter
                  </button>
                </div>
              ) : step === 'login' ? (
                // ÉTAPE 2: CONNEXION
                <div>
                  <div className="px-4 md:px-8 py-4">
                    <button
                      onClick={() => setStep('welcome')}
                      className="bg-none border-none text-decoration-none text-gray-600 p-0 mb-4 flex items-center text-sm font-medium hover:text-gray-800"
                    >
                      <ArrowLeft size={16} className="me-2" />
                      Retour
                    </button>
  
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                      Connexion a AZ-RD
                    </h2>
                    <p className="text-gray-600 text-center mb-4 text-sm">
                      Entrez vos identifiants pour continuer
                    </p>
  
                    {/* Login Method Toggle */}
                    <div className="flex bg-slate-100 rounded-lg p-1 mb-8 gap-2">
                      <button
                        onClick={() => {
                          setLoginMethod('email');
                          localStorage.setItem('preferredLoginMethod', 'email');
                        }}
                        className={`flex-1 text-sm rounded font-medium px-3 py-2 transition-all ${
                          loginMethod === 'email'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Mail size={14} className="inline me-1" />
                        Email
                      </button>
                      <button
                        onClick={() => {
                          setLoginMethod('code');
                          localStorage.setItem('preferredLoginMethod', 'code');
                        }}
                        className={`flex-1 text-sm rounded font-medium px-3 py-2 transition-all ${
                          loginMethod === 'code'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Hash size={14} className="inline me-1" />
                        AZ-ID
                      </button>
                    </div>
                   
                    {/* <ErrorDisplay /> */}
  
                    <form onSubmit={handleSubmit}>

                      {loginMethod === 'email' ? (
                          <div className="animate__animated animate__fadeIn">
                            {/* Email Input */}
                            <div className="mb-4">
                              <label className="block text-left text-slate-700 font-medium mb-2">
                                Email
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                  type="email"
                                  name="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="Entrez votre email"
                                  className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-slate-900"
                                  required
                                />
                              </div>
                            </div>

                            {/* Password Input */}
                            <div className="mb-3">
                              <label className="block text-left text-slate-700 font-medium mb-2">
                                Mot de passe
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  name="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Entrez votre mot de passe"
                                  className="w-full pl-12 pr-12 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-slate-900"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="animate__animated animate__fadeIn">
                            {/* Identification Code */}
                            <div className="mb-4">
                              <label className="block  font-bold text-gray-700 text-sm mb-3">
                                Code d'identification confidentiel
                              </label>
                              <div className="flex justify-center items-center gap-2">
                                {code.map((value, index) => (
                                  <React.Fragment key={index}>
                                    <input
                                      id={`code-${index}`}
                                      type="text"
                                      value={value}
                                      onChange={(e) => {
                                        const newCode = [...code];
                                        newCode[index] = e.target.value.replace(/\D/g, '').slice(-2);
                                        setCode(newCode);
                                        // Auto-focus prochain champ si rempli
                                        if (value.length === 2 && index < code.length - 1) {
                                              inputRefs.current[index + 1]?.focus();
                                            }
                                      }}
                                      className="border border-gray-300 rounded-lg text-center font-bold shadow-sm text-lg p-2"
                                      style={{ width: '55px', height: '55px'}}
                                      maxLength={2}
                                      placeholder="00"
                                    />
                                    {index < code.length - 1 && (
                                      <span className="text-xl text-gray-400">•</span>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>

                            {/* Password Input for Code Method */}
                            <div className="mb-3">
                              <div>
                                  <label className="block  text-slate-700 font-medium mb-2">
                                    Mot de passe
                                  </label>
                                  <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                      type={showPassword ? 'text' : 'password'}
                                      name="password"
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      placeholder="Entrez votre mot de passe"
                                      className="w-full pl-12 pr-12 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-slate-900"
                                      required
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                  </div>
                                </div>
                            </div>
                          </div>
                        )}
                    
  
                      {/* Login Button */}
                       <button
                          type="submit"
                          className="w-full font-semibold py-2 text-white rounded-lg bg-gradient-to-r from-blue-900 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all"
                        >
                          {loading ? 'Connexion en cours...' : 'Connecter →'}
                        </button>

                      {/* <LoadingButton
                        type="submit"
                        loading={loading}
                        disabled={!isFormValid()}
                        className="btn w-100 text-white py-3 rounded-3 fw-semibold shadow-lg small"
                        style={{background: 'linear-gradient(to right, #0d9488, #06b6d4)'}}
                      >
                        Se connecter →
                      </LoadingButton> */}
                    </form>
  
                    {/* Security Notice */}
                    <div className="flex items-start gap-2 mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <Shield size={16} className="text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="mb-0 text-sm font-semibold text-blue-900">Connexion sécurisée</p>
                        <p className="mb-0 text-sm text-blue-900">Vos données sont sécurisées et protégées.</p>
                      </div>
                    </div>
                  </div>
                </div>
               ):step === 'company' ? (
                  // ÉTAPE 3: SÉLECTION D'ENTREPRISE
                  <div>
                    <div className="px-4 md:px-8 py-4">
                      <button
                        onClick={() => setStep('login')}
                        className="bg-none border-none text-decoration-none text-cyan-600 p-0 mb-4 flex items-center text-sm font-medium hover:text-cyan-700"
                      >
                        <ArrowLeft size={16} className="me-2" />
                        Retour
                      </button>

                      <div className="mb-4">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
                          Sélectionnez votre entreprise
                        </h2>
                        <p className="text-gray-600 text-center text-sm">
                          Choisissez parmi vos entreprises disponibles
                        </p>
                      </div>

                    

                      <div className={`grid gap-3 mb-4 ${companies.length > 1 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                        {companies.map((company, index) => (
                          <div key={company?.user?.Customers_Numbers} className={companies.length > 1 ? '' : ''}>
                            <button
                              onClick={() => handleChoose(company)}
                              disabled={loading}
                              className="w-full h-full p-4 text-left relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 hover:border-teal-600 hover:from-blue-50 hover:to-cyan-50 hover:scale-105 transition-all"
                            >
                              {/* Index badge */}
                              <span className="absolute top-0 right-0 m-3 inline-flex items-center justify-center rounded-full bg-cyan-500 text-white font-semibold" style={{width: '24px', height: '24px', fontSize: '11px'}}>
                                {index + 1}
                              </span>

                              <div className="flex items-start justify-between">
                                <div className="flex-grow pr-3">
                                  {/* Company icon */}
                                  <div className="rounded-lg flex items-center justify-center mb-3 shadow-sm w-12 h-12 bg-gradient-to-br from-blue-900 to-teal-600">
                                    <Building size={24} className="text-white" />
                                  </div>
                                  
                                  {/* Company name */}
                                  <p className="font-bold text-gray-900 mb-2 h-6 text-sm line-clamp-2">
                                    {company?.user?.Names} 
                                  </p>
                                  
                                  {/* City */}
                                  {/* {company.company_city && (
                                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                                      <span className="rounded-full bg-cyan-500 inline-block mr-2" style={{width: '4px', height: '4px'}}></span>
                                      {company.company_city}
                                    </p>
                                  )} */}
                                  
                                  {/* AFRICA ID */}
                                  <p className="text-sm text-gray-600 mb-0" style={{fontFamily: 'monospace'}}>
                                    ID: {company?.user?.Customers_Numbers}
                                  </p>
                                </div>
                                
                                {/* Arrow icon */}
                                <div className="text-gray-600">
                                  <svg className="bi" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                  </svg>
                                </div>
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Info box */}
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="text-blue-500 flex-shrink-0 mt-1">
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="mb-1 text-sm font-semibold text-blue-900">Besoin d'aide ?</p>
                          <p className="mb-0 text-sm text-blue-900">Sélectionnez l'entreprise pour laquelle vous souhaitez accéder sur AZ-RemoteDesk.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
             
            </div>

          {/* Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-gray-900 text-white mt-4 px-3 py-4">
            <div className="flex items-center justify-center" style={{fontSize: '11px'}}>
              <div className="flex flex-wrap items-center justify-start text-center w-full">
                <span className="font-bold" style={{ fontSize:'15px' }}>AZ RD</span>
                <span className="mx-1">est un produit de la suite</span>
                <span className="flex items-center gap-1">
                  <a href="https://az-companies.com/" target="_blank" rel="noopener noreferrer">
                    <img src={az} style={{height: '16px', objectFit: 'contain'}} />
                  </a>
                  
                   <a href="https://az-companies.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 font-semibold text-decoration-none"
                    aria-label="AZ-COMPANIES 360°"
                  >
                    <span style={{ fontSize: '12px' }}> AZ-COMPANIES 360° </span> 
                  </a>
                </span>
              </div>
            </div>
            
           <div className="flex items-center justify-center gap-2">
              <a href="mailto:sales@africadigitalizer.com" className="inline-flex items-center justify-center bg-white text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors" aria-label="Email" style={{width: '32px', height: '32px'}}>
                <Mail style={{width: '20px', height: '20px'}} />
              </a>
              <a href="https://www.facebook.com/share/16U9aFNSUF/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors" aria-label="Facebook" style={{width: '32px', height: '32px'}}>
                <Facebook style={{width: '20px', height: '20px'}} />
              </a>
              <a href="https://youtube.com/@azcompanies" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors" aria-label="Youtube" style={{width: '32px', height: '32px'}}>
                <Youtube style={{width: '20px', height: '20px'}} />
              </a>
              <a href="https://www.instagram.com/azcompaniescom?igsh=MWh6YXJraHJ4cmZsOA==" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors" aria-label="Instagram" style={{width: '32px', height: '32px'}}>
                <Instagram style={{width: '20px', height: '20px'}} />
              </a>
               <a href="https://www.instagram.com/azcompaniescom?igsh=MWh6YXJraHJ4cmZsOA==" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors" aria-label="Instagram" style={{width: '32px', height: '32px'}}>
                  <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Calque_2"
                        data-name="Calque 2"
                        viewBox="0 0 140.46 181.79"
                        width="20"
                        height="20"
                    >
                        <defs>
                            <style type="text/css">
                                {`
                                    .cls-1 {
                                        fill: #0f6fec;
                                    }
                                    .cls-2 {
                                        fill: #754c24;
                                    }
                                `}
                            </style>
                        </defs>
                        <g id="Calque_1-2" data-name="Calque 1">
                            <g>
                            <path d="M129.98,48.74s.02-.06.04-.08c.24-.16.47-.32.69-.51.08-.06.16-.12.24-.2,4.68-4.01,7.98-9.6,9.07-15.92.28-1.54.43-3.14.43-4.76s-.14-3.22-.43-4.76c-1.22-6.99-5.12-13.07-10.61-17.16-4.54-3.34-10.17-5.35-16.25-5.35-5.65,0-10.92,1.72-15.27,4.68-6,4.05-10.29,10.43-11.59,17.83-.28,1.54-.43,3.14-.43,4.76s.14,3.22.43,4.76c1.24,7.11,5.25,13.27,10.86,17.34-.95.69-1.86,1.44-2.71,2.25v.02c-2.94,2.75-5.25,6.14-6.72,9.97-.06.16-.12.32-.18.49-.55,1.72-.91,3.46-1.09,5.12-.02.12-.02.24-.04.36-.06.67-.1,1.34-.1,1.96-.06,1.66-.02,3.26-.1,4.92,0,.28-.02.55-.04.83-.06.87-.16,1.76-.34,2.69-2.92,15.05-16.65,27.12-31.68,29.15v-.41h-.08v-40.53c-1.34-6.89-5.29-12.86-10.78-16.83,5.49-3.97,9.44-9.95,10.78-16.83v-.04c.49-2.49.85-6.16,0-10.47,0-.08-.1-.55-.22-1.03-.81-3.48-3.52-10.8-10.72-15.92C38.67,1.88,33.2,0,27.29,0s-11.24,1.84-15.68,4.96C5.69,9.12,1.5,15.56.34,22.99c-.22,1.4-.34,2.82-.34,4.27s.12,2.88.34,4.27c.81,5.21,3.1,9.91,6.42,13.67,1.34,1.56,2.86,2.96,4.54,4.15-4.01,2.9-7.21,6.87-9.16,11.47-.06.16-.12.3-.18.47-.75,1.86-1.32,3.83-1.62,5.87v88.15c.45,6.46,2.37,11.69,5.29,15.74.18.26.38.55.61.79,1.56,1.9,3.36,3.57,5.37,4.98,3,2.11,6.46,3.65,10.19,4.42.75.14,1.54.26,2.31.34.24.04.49.06.71.08.04.02.08.02.12.02.28.02.55.04.83.06h.26c.2.02.41.02.63.02.61.02,1.2,0,1.8-.02.38-.02.79-.04,1.2-.08.38-.02.77-.06,1.13-.12.43-.04.85-.1,1.26-.18.2-.02.38-.06.59-.1.18-.02.36-.06.57-.12.3-.06.61-.14.91-.2,3.28-.85,6.34-2.31,9.01-4.23,4.44-3.16,7.88-7.62,9.78-12.82.04-.12.08-.24.12-.36.49-1.6.85-3.3,1.03-5.1v-29.13c-1.09-6.32-9.28-6.28-10.74.12-.1.38-.16.79-.2,1.22v9.34c.16,4.17.49,14.2.49,14.99,0,1.38-.16,2.71-.49,3.99-.2.79-.47,1.56-.77,2.31-.12.26-.22.53-.34.77-1.09,2.59-2.84,4.6-4.96,6.02-.22.16-.45.32-.67.47-2.61,1.76-5.73,2.78-9.1,2.78-3.85,0-7.39-1.34-10.19-3.59-.12-.1-.26-.2-.38-.3-2.47-1.86-4.33-4.48-5.1-7.8-.04-.12-.06-.26-.08-.41,0-.04-.02-.1-.04-.16-.32-1.3-.51-2.67-.51-4.07,0-1.2.36-54.61.36-54.61.08.1.18.18.26.28,8.45,9.18,19.04,15.7,31.52,17.26.91.12,1.84.2,2.78.26,2.75.18,5.47.12,8.16-.18,12.62-1.36,24.23-7.7,32.25-17.18,2.75-3.24,5.08-6.87,6.89-10.78,1.78-3.87,3.04-8.02,3.71-12.38.63-4.17.06-7.74.87-11.42.02-.16.06-.32.12-.51.28-1.13.71-2.31,1.38-3.5,1.84-3.3,4.6-5.49,7.72-6.66.04-.02.08-.04.12-.04,1.09-.49,2.25-.85,3.46-1.07.97-.18,1.99-.28,3.02-.28.91,0,1.82.08,2.69.22,6.52,1.09,11.75,6.1,13.13,12.54v86.68c.04.45.04,2.31,0,2.75-.14,1.62-.51,3.16-1.07,4.6-.04.12-.1.24-.14.38-.97,2.67-2.63,4.74-4.66,6.24-.12.1-.26.2-.38.3-2.75,2.15-6.24,3.42-9.99,3.42s-7.25-1.28-10.03-3.44c-.12-.08-.24-.18-.36-.28-2.25-1.64-4.01-3.93-4.88-6.81v-.02c-.02-.06-.04-.1-.06-.16-.65-1.76-.91-7.52-.75-8.43v-.02c-.02-6.44.71-13.37.57-19.75-.02-.93-.06-1.86-.12-2.78-.04-.77-.12-1.54-.2-2.29-.04-.45-.63-4.07-3.57-5.19-2.09-.79-4.58-.06-5.89,1.48-1.26,1.48-1.36,3.61-1.36,3.97,0,.08.02.77.02,1.72v.02c.04,3.65-.08,7.37-.22,11.1v14.1c0,9.22,4.58,17.38,11.59,22.3,3.36,2.39,7.29,4.01,11.55,4.66.47.08.95.14,1.44.18,6.5.55,13.19-1.07,18.53-5,5.55-4.05,9.66-10.57,10.61-19.75v-89.19c-.24-1.92-.63-3.77-1.22-5.57,0-.04-.02-.06-.02-.08-1.84-5.04-5.15-9.38-9.38-12.54-.08-.04-.16-.1-.24-.16.08-.06.16-.12.24-.18.18-.14.38-.28.57-.45ZM10.13,27.26c0-2.47.53-4.82,1.48-6.95,2.09-4.74,6.28-8.35,11.38-9.66.34-.1.69-.16,1.03-.24.49-.1.99-.18,1.48-.22.59-.04,1.17-.08,1.78-.08.18,0,.36,0,.55.02,6.89.2,12.76,4.48,15.29,10.49.06.16.14.32.2.49.73,1.9,1.13,3.99,1.13,6.16,0,1.84-.28,3.61-.83,5.27-.14.47-.32.93-.51,1.38-2.31,5.53-7.43,9.56-13.55,10.37-.75.1-1.52.16-2.29.16s-1.54-.06-2.29-.16c-.99-.12-1.96-.34-2.9-.63-3.79-1.22-7.01-3.69-9.14-6.95-.53-.79-.99-1.62-1.36-2.49-.95-2.13-1.48-4.48-1.48-6.95ZM43.13,106.26v.34c-.06-.02-.14-.02-.2-.04l-.06.1c-6.58-.83-12.66-3.77-17.66-8.02-2.75-2.33-5.19-5.06-7.19-8.08-.34-.51-.67-1.01-.97-1.52-.28-.47-.55-.93-.81-1.4-.32-.59-.63-1.2-.93-1.8-.26-.55-.51-1.09-.75-1.66-1.32-3.04-2.23-6.26-2.63-9.52v-.04c-.12-.41-.22-.83-.3-1.26-.18-.99-.28-2.01-.28-3.04s.1-2.05.28-3.04c.04-.18.08-.38.12-.57.06-.28.14-.57.22-.83.02-.12.06-.24.1-.36.61-2.55,2.07-4.84,4.01-6.64l.2-.2c2.23-2.17,5.08-3.69,8.28-4.27h.02c.95-.18,1.92-.26,2.94-.26.95,0,1.88.08,2.78.24h.02c6.22,1.07,11.22,5.73,12.82,11.77v20.36l.1,7.07.16,12.28-.26.41ZM129.01,33.91c-2.31,5.53-7.43,9.56-13.57,10.37-.75.1-1.52.16-2.29.16s-1.54-.06-2.29-.16c-.99-.12-1.96-.34-2.9-.63-3.79-1.22-7.01-3.69-9.14-6.95-.53-.79-.99-1.62-1.36-2.49-.95-2.13-1.48-4.48-1.48-6.95s.53-4.82,1.48-6.95c.91-2.07,2.23-3.93,3.85-5.47.22-.22.47-.45.71-.65.24-.2.49-.41.75-.61.24-.18.51-.36.77-.55.28-.18.55-.36.83-.53.26-.16.55-.3.83-.45.67-.36,1.36-.67,2.09-.91.51-.2,1.01-.36,1.56-.51.34-.1.69-.16,1.03-.24.49-.08.99-.16,1.48-.22.59-.04,1.17-.08,1.78-.08.18,0,.36,0,.55.02,6.91.2,12.78,4.48,15.31,10.49.06.16.14.32.2.49.73,1.9,1.13,3.99,1.13,6.16,0,1.84-.28,3.61-.83,5.27-.14.47-.32.93-.51,1.38Z"/>
                            <path className="cls-1" d="M44.47,27.26c0,1.84-.28,3.61-.83,5.27-.14.47-.32.93-.51,1.38-2.31,5.53-7.44,9.56-13.57,10.37-.75.1-1.52.16-2.29.16s-1.54-.06-2.29-.16c-.99-.12-1.97-.34-2.9-.63-3.79-1.22-7.02-3.69-9.14-6.95-.53-.79-.99-1.62-1.36-2.49-.95-2.13-1.48-4.48-1.48-6.95s.53-4.82,1.48-6.95c2.09-4.74,6.29-8.35,11.4-9.66.34-.1.69-.16,1.03-.24.49-.08.99-.16,1.48-.22.59-.04,1.18-.08,1.78-.08.18,0,.36,0,.55.02,6.89.2,12.77,4.48,15.31,10.49.06.16.14.32.2.49.73,1.9,1.14,3.99,1.14,6.16Z"/>
                            <path className="cls-2" d="M130.35,27.26c0,1.84-.28,3.61-.83,5.27-.14.47-.32.93-.51,1.38-2.31,5.53-7.43,9.56-13.57,10.37-.75.1-1.52.16-2.29.16s-1.54-.06-2.29-.16c-.99-.12-1.96-.34-2.9-.63-3.79-1.22-7.01-3.69-9.14-6.95-.53-.79-.99-1.62-1.36-2.49-.95-2.13-1.48-4.48-1.48-6.95s.53-4.82,1.48-6.95c.91-2.07,2.23-3.93,3.85-5.47.22-.22.47-.45.71-.65.24-.2.49-.41.75-.61.24-.18.51-.36.77-.55.28-.18.55-.36.83-.53.26-.16.55-.3.83-.45.2-.1.41-.18.61-.26.49-.24.97-.45,1.48-.65.51-.2,1.01-.36,1.56-.51.34-.1.69-.16,1.03-.24.49-.08.99-.16,1.48-.22.59-.04,1.17-.08,1.78-.08.18,0,.36,0,.55.02,6.91.2,12.78,4.48,15.31,10.49.06.16.14.32.2.49.73,1.9,1.13,3.99,1.13,6.16Z"/>
                            </g>
                        </g>
                    </svg>
              </a>
               <a href="https://www.linkedin.com/company/az-companies.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors" aria-label="LinkedIn" style={{width: '32px', height: '32px'}}>
                <Linkedin style={{width: '20px', height: '20px'}} />
              </a>
               {/* <a href="https://www.tiktok.com/@az.companies.360?_r=1&_t=ZS-93VC6snsmg6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors" aria-label="TikTok" style={{width: '32px', height: '32px'}}>
                <BsTiktok style={{width: '20px', height: '20px'}} />
              </a> */}
               <a href="https://www.whatsapp.com/channel/0029Va8urmAEKyZLjzLkzZ28" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors" aria-label="WhatsApp" style={{width: '32px', height: '32px'}}>
                <MessageCircle style={{width: '20px', height: '20px'}} />
              </a>
            </div>
            
            <div className="flex items-center justify-center text-center" style={{fontSize: '11px'}}>
              <span>
                <span className="block w-full font-bold">ERP conçu par : <img src={ad} alt="Logo" style={{height: '20px'}} className="inline" /> avec <Heart size={15} fill="red" color='red' className="inline"/></span>
                <a href="https://africadigitalizer.com" target='_blank' rel="noopener noreferrer" className='text-white text-decoration-none'> 
                  © {new Date().getFullYear()} <span className='font-bold' style={{ color:'green' }}> Africa Digitalizer </span>  
                </a> 
                  Tous droits réservés.              
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>  
   )
}

export default Login;