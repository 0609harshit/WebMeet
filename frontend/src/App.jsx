import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home.jsx';
import Choice from './pages/choice.jsx'
import Meet from './pages/meet.jsx'
import {Login} from './pages/login.jsx'
import { ContextProvider } from './context/manageContext.jsx';


function App(){
  return(

      <BrowserRouter>
          <ContextProvider>
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/choice' element={ <Choice/>}/>
              <Route path='/meet/:meetCode' element={ <Meet/> }/>
          </Routes>
          </ContextProvider>
      </BrowserRouter>
  )
} 

export default App;