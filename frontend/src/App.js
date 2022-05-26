import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

/* import components */
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer' // navbar fica fixo mesmo as pg mudando
import Container from './components/layout/Container'
import Message from './components/layout/Message'

/* import pages */
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Home from './components/pages/Home'
import Profile from './components/pages/User/Profile'
import MyPets from './components/pages/Pet/MyPets'
import AddPet from './components/pages/Pet/AddPets'

/* context */
import {UserProvider} from './context/UserContext'


function App() {
  return (
    <Router>
      <UserProvider>
          <Navbar />
            <Message />
            <Container>
              <Routes>

              <Route path='/login' element={<Login/>} />
              <Route path='/register' element={<Register/>} />
              <Route path='/User/Profile' element={<Profile />} />
              <Route path='/pet/mypets' element={<MyPets />} />
              <Route path='/pet/add' element={<AddPet />} />
              <Route path='/' element={<Home/>} />

              </Routes>
            </Container>
          <Footer />
      </UserProvider>
    </Router>
  )
}

export default App;
/*

*/