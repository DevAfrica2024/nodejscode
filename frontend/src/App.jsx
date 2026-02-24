import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import AnyDeskDashboard from './pages/AnyDeskDashboard'
import Sender from './pages/Sender'
import Receiver from './pages/Receiver'
import Login from './pages/Login'
import { AuthProvider } from './contexts/authContext'
import { CookiesProvider } from 'react-cookie'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './component/ProtectedRoute'
import HomeRedirect from './component/HomeRedirect'

function App() {
  return (
    <CookiesProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                 <Route path="/sender" element={<Sender/>}/>
                <Route path="/receiver" element={<Receiver/>} />
                <Route path='/' element={<HomeRedirect/>} />
                <Route path='/login' element={
                      <Login/>
                   } />
                <Route path='/dashboard' element={
                      <Dashboard/>
                   } />
                   
              </Routes>
            </AuthProvider>
          </BrowserRouter>
    </CookiesProvider>
  
  )
}

export default App
