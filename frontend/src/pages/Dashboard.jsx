import React, { useEffect, useState } from 'react';
import { Monitor,User, ChevronDown, LogOut, Settings, Users, User2, Menu, X } from 'lucide-react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import Receiver from './Receiver';
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from '../contexts/authContext';
import { decryptData, encryptData } from '../utils/crypto';



export default function Dashboard() {
  const token  = ()=>{
          const token = Cookies.get('authKey');
          return token;
      }

     // console.log("Token dans Dashboard:", token());

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState(selectedEmployee?.Email || '');
  const [showCustomers, setShowCustomers] = useState(true);
  const [loading, setLoading] = useState(false);   
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [companieSelected, setCompanieSelected] = useState({});
  const {user,setCompanies,companies,updateToken} = useAuth();
  const navigate = useNavigate();


  useEffect(()=>{
      if(companies?.length === 0){
        const storedCompanies = localStorage.getItem('accessible_companies');
        const storedSelcetedCompany = localStorage.getItem('selected_company');


         if(storedSelcetedCompany){
          setCompanieSelected(decryptData(storedSelcetedCompany));
         }
        setCompanies(decryptData(storedCompanies));
      }
  },[])

  useEffect(() => {
    if (isModalOpen) {
        setEmail(selectedEmployee?.Email || '');
    }
}, [selectedEmployee, isModalOpen]);


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isValidEmail = (email) => {
    return emailRegex.test(email);
};

  
const handleSubmit = async(e)=>{
    e.preventDefault();
      if (!isValidEmail(email)) {
        alert("Adresse email invalide");
        return;
    }

    setLoadingInvite(true);
   const formData = new FormData();
   formData.append('email', email || selectedEmployee?.Email);
   formData.append('employee_id', selectedEmployee?.employees_Number);
   formData.append('name', selectedEmployee?.FirstName );
   formData.append('lastname', selectedEmployee?.LastName);

    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/company/invite`, formData, {
            headers: {
                Authorization: `${token()}`
            }
        });
        if(response.data.status === 200){
          setIsModalOpen(false);
          setEmail('');
            setLoadingInvite(false);
        }
    } catch (error) {
      console.error("Erreur lors de l'envoi du lien d'invitation :", error.response?.data || error.message);
    }
}


  const fetchCustomersData = async () => {
    setLoading(true);
   const authToken = token();

   if (!authToken) {
      console.log("Pas de token, requête annulée");
      return;
   }

   try {
      const response = await axios.get(
         `${import.meta.env.VITE_BASE_URL}/company/customers`,
         {
            headers: {
               Authorization: `${authToken}`
            }
         }
      );

     // console.log("Données des clients reçues :", response.data.customers);
    if(response.data.status === 200){
      setCustomerData(response.data.customers);
      setShowCustomers(true);
      setLoading(false);
    }

   } catch (error) {
      console.error("Erreur :", error.response?.data || error.message);
   } finally{
        setLoading(false);
   }

};


  useEffect(()=>{
    fetchCustomersData();
  },[])

  const filteredCustomers = customerData.filter((customer) => {
    const searchLower = search.toLowerCase();

    return (
        customer.Names?.toLowerCase().includes(searchLower) 
    );
});

const filteredEmployees = employeesData.filter((employee) => {
  const searchLower = search.toLowerCase();

  return (
      employee.FirstName?.toLowerCase().includes(searchLower) ||
      employee.LastName?.toLowerCase().includes(searchLower) ||
      employee.Email?.toLowerCase().includes(searchLower)
  );
});

const handleSelectCompany = async (customer) => {
    setLoadingEmployees(true);
    setShowCustomers(false);
  try {
     const res =  await axios.post(`${import.meta.env.VITE_BASE_URL}/company/get/employers`, 
    { company_id: customer.az_id,
      customer_db: customer.customer_db
     }, {
      headers: {
         Authorization: `${token()}`
      }
   })

   if(res.data.status === 200){ 
    //console.log("Employés de l'entreprise sélectionnée :", res.data.employers);
    setShowCustomers(false);
    setLoadingEmployees(false)
    setEmployeesData(res.data.employers);
   }
   if(res.data.status === 404){
    toast.error(res.data.message)
    setLoadingEmployees(true)
    setShowCustomers(false);
    setEmployeesData([]);
    setSelectedEmployee(null)
   }
 // setSidebarOpen(false);
  } catch (error) {
    console.log("Erreur lors de la sélection de l'entreprise :", error.response?.data || error.message);
  }finally{
    setLoadingEmployees(false)
  }
}

//console.log(loadingEmployees)

const handleLogout = ()=>{
    Cookies.remove('authKey');
    localStorage.clear();
    navigate('/login');
}

  const handleChoose = async (company) => {
     localStorage.setItem('selected_company', encryptData(company));
     window.location.reload();
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
            ///localStorage.setItem('data', JSON.stringify(res.data.data));
            navigate('/dashboard');
            }

            //console.log("Response from select-company:", res.data);

        } catch (error) {
            console.error("Erreur lors de la sélection de l'entreprise :", error.response?.data || error.message);
        }
    };

const initials = `${user?.LastName?.[0] || ""}${user?.Names?.[0] || ""}`;
//console.log("Initiales générées :", companieSelected);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <ToastContainer/>

       {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 to-teal-600 shadow-md">
            <div className="px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between gap-3">

                    {/* Section Gauche : Menu (et Logo caché sur mobile) */}
                    <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-blanc hover:bg-white/10 p-2 rounded-md transition"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <div className="hidden md:flex items-center gap-2">
                        <Monitor className="text-white" size={32} />
                        <h2 className="text-xl font-bold text-white whitespace-nowrap">
                        Remote Desk
                        </h2>
                    </div>
                    </div>

                    {/* 🔎 Barre de recherche */}
                    <div className="flex-1 flex justify-center max-w-2xl">
                    <div className="relative w-full">
                        <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher..."
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm md:text-base"
                        />
                        <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.4a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    </div>

                    {/* 👤 Profil Dropdown */}
                    <div className="relative flex items-center shrink-0">
                        <div
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1 md:px-3 md:py-2 rounded-lg cursor-pointer hover:bg-white/10 transition"
                        >
                            {/* Avatar Simple pour le Header */}
                            <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white border-2 border-white/50 overflow-hidden shadow-sm">
                        
                            <img 
                                src={`https://ui-avatars.com/api/?name=${initials}&background=0d9488&color=fff`} 
                                alt="User" 
                                className="w-full h-full object-cover"
                            />

                            </div>
                            <ChevronDown
                            className={`hidden sm:block w-4 h-4 text-white transition-transform ${
                                isProfileOpen ? "rotate-180" : ""
                            }`}
                            />
                        </div>

                    {/* Dropdown Menu - Largeur augmentée à w-64 pour le contenu riche */}
                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 !bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                        
                        {/* 1. Infos Utilisateur */}
                        <div className="px-4 pb-3 flex items-center gap-3 border-bottom border-gray-50">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                <img 
                                src={`https://ui-avatars.com/api/?name=${initials}&background=0d9488&color=fff`} 
                                alt="User" 
                                className="w-full h-full object-cover"
                            />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-gray-800 truncate">{user?.LastName} {user?.Names}</span>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full w-fit">
                                {companieSelected?.user?.Names}
                            </span>
                            </div>
                        </div>

                        <hr className="mx-4 my-2 border-gray-100" />

                        {/* 2. Actions Rapides */}
                        <div className="px-2">
                            <button className="w-full px-3 py-2 text-left !bg-white hover:!bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors rounded-lg border-none">
                            <User size={16} className="text-gray-400" />
                            <span className="text-sm">Mon Profil</span>
                            </button>
                            <button className="w-full px-3 py-2 text-left !bg-white hover:!bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors rounded-lg border-none">
                            <Settings size={16} className="text-gray-400" />
                            <span className="text-sm">Paramètres</span>
                            </button>
                        </div>

                        <div className="px-4 mt-3 mb-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mes Entreprises</p>
                        </div>

                        {/* 3. Liste des Entreprises */}
                        <div className="px-2 max-h-40 overflow-y-auto">
                            {
                                companies?.map((company)=>(
                                    <button onClick={()=>handleChoose(company)}  key={company?.company_number} className="w-full px-3 py-2 text-left !bg-white hover:!bg-blue-50 flex items-center justify-between group rounded-lg border-none">
                                            <div  className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                                <span className="text-sm text-gray-600 group-hover:text-blue-700">{company?.user?.Names}</span>
                                            </div>
                                            {company?.user?.Customers_Numbers === companieSelected?.user?.Customers_Numbers && <div className="w-2 h-2 rounded-full bg-green-500"></div> }
                                    </button>
                                ))
                            }
                        

                            {/* <button className="w-full px-3 py-2 text-left !bg-white hover:!bg-gray-50 flex items-center gap-3 group rounded-lg border-none">
                            <div className="w-7 h-7 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">EB</div>
                            <span className="text-sm text-gray-600">Entreprise B</span>
                            </button> */}
                        </div>

                        <hr className="mx-4 my-2 border-gray-100" />

                        {/* 4. Déconnexion */}
                        <div className="px-2">
                            <button 
                            onClick={handleLogout} 
                            className="w-full px-3 py-2 text-left !bg-white hover:!bg-red-50 flex items-center gap-3 text-red-600 transition-colors rounded-lg border-none"
                            >
                            <LogOut size={16} />
                            <span className="text-sm font-bold">Déconnexion</span>
                            </button>
                        </div>
                        
                        </div>
                    )}
                    </div>

            </div>
        </header>


      {/* Main Content */}
      {
            loading ? (<div className="flex justify-center mt-2">
                               <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                             </div>) : (
            <>
                 <div className="flex-1 flex overflow-hidden relative">
                    {/* Backdrop pour mobile */}
                    {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 lg:hidden z-30"
                        onClick={() => setSidebarOpen(false)}
                    />
                    )}

                    {/* Sidebar - Liste des employés */}
                
                    <aside className={`h-screen w-80 bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 lg:relative fixed inset-y-0 left-0 z-40 lg:z-auto ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}>
                    <div className="p-4 border-b border-gray-200">
                        <button
                                onClick={() => setShowCustomers(true)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-900 to-teal-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Liste des clients
                        </button>
                        <h2 className="text-lg font-semibold text-gray-900">{showCustomers ? "Clients" : "Employés"}</h2>
                        <p className="text-sm text-gray-500 mt-1">{showCustomers ? filteredCustomers?.length + ' Clients' : filteredEmployees?.length + ' Employés'}</p>
                    </div>
                    
                    <div className="p-2">

                        {showCustomers && filteredCustomers?.map((customer) => (
                        <button
                            key={customer.Customers_Numbers}
                            onClick={() => handleSelectCompany(customer)}
                            className={`w-full p-3 rounded-lg mb-2 flex items-center gap-3 transition-all ${
                            selectedEmployee?.Customers_Numbers === customer.Customers_Numbers
                                ? 'bg-blue-50 border-2 border-blue-500'
                                : 'hover:bg-gray-50 border-2 border-transparent'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-teal-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {customer?.avatar || <User2/>}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{customer?.Names}</p>
                            <p className="text-sm text-gray-500 truncate">{customer?.TypeEmplyement}</p>
                            </div>
                        </button>
                        ))}


                        { loadingEmployees ? (
                             <div className="flex justify-center">
                               <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                             </div>
                            ) : (
                            !showCustomers && filteredEmployees?.map((employee) => (
                                <button
                                    key={employee.employees_Number}
                                    onClick={() => {
                                    setSelectedEmployee(employee);
                                    setSidebarOpen(false);
                                    }}
                                    className={`w-full p-3 rounded-lg mb-2 flex items-center gap-3 transition-all ${
                                    selectedEmployee?.employees_Number === employee.employees_Number
                                        ? 'bg-blue-50 border-2 border-blue-500'
                                        : 'hover:bg-gray-50 border-2 border-transparent'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-teal-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                    {employee?.avatar || <User2/>}
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{employee?.FirstName} {employee?.LastName}</p>
                                    <p className="text-sm text-gray-500 truncate">{employee?.TypeEmplyement}</p>
                                    </div>
                                </button>)
                        ))}

                    </div>
                    </aside>

                    
                    {/* Modal Responsive */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center sm:items-center justify-center z-50 p-0 sm:p-4">
                            <div className="bg-white rounded-t-2xl sm:rounded-xl p-6 w-full max-w-md animate-in slide-in-from-bottom sm:zoom-in duration-200">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Renseigner un email</h2>
                                
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-6">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Adresse email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="exemple@email.com"
                                            className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                setEmail('');
                                            }}
                                            className="px-4 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loadingInvite}
                                            className="px-4 py-2.5 bg-gradient-to-r from-blue-900 to-teal-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-bold transition-all"
                                        >
                                            {loadingInvite ? "Envoi en cours..." : "Valider"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Main Dashboard Area */}
                    <main className="flex-1 overflow-y-auto p-8">
                    {selectedEmployee ? (
                        <div className="max-w-4xl">
                           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-8">
                                {/* Conteneur Header de l'employé */}
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 mb-6 text-center sm:text-left">
                                    
                                    {/* Avatar : Ajustement taille sur mobile */}
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-900 to-teal-600 flex items-center justify-center text-white text-2xl md:text-3xl font-semibold flex-shrink-0 shadow-lg">
                                        {selectedEmployee?.avatar || <User2 className="w-8 h-8 md:w-10 md:h-10" />}
                                    </div>

                                    {/* Informations : Hiérarchie de texte fluide */}
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 truncate">
                                            {selectedEmployee.FirstName} {selectedEmployee.LastName}
                                        </h2>
                                        <div className='flex flex-col items-center sm:items-start space-y-1'>
                                            <p className="text-base md:text-lg text-gray-600">
                                                <span className="font-medium  italic">Type: </span>
                                                {selectedEmployee?.TypeEmplyement}
                                            </p>
                                            <p className="text-base md:text-lg text-gray-600 break-all">
                                                <span className="font-medium  italic">Email: </span>
                                                {selectedEmployee?.Email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bouton d'action : Pleine largeur sur mobile */}
                                <div className="mt-6">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-900 to-teal-600 text-white rounded-lg hover:shadow-md transition-all active:scale-95 font-medium"
                                    >
                                        Envoyer le lien
                                    </button>
                                </div>

                            </div>

                              <Receiver/>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                       { filteredEmployees.length >0 && selectedEmployee === null && (
                        <div className="text-center">
                            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Sélectionnez un employé
                            </h3>
                            <p className="text-gray-500">
                            Cliquez sur un employé dans la liste pour voir ses détails
                            </p>
                        </div>
                       ) } 
                        </div>
                    )}
                    </main>
                </div>
            </>
        )
      }
     
    </div>
  );
}