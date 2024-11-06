import { useState } from 'react'
import { AppContext } from './AppContext'
import LoginView from './views/LoginView'
import Accueil from './views/Accueil'
import './App.css'

function App(){

  const [token, setToken] = useState(null)
  const [username, setUsername] = useState("")
  const [login, setLogin] = useState("")
  const [count, setCount] = useState(0)

  const backend = "https://appweb.osc-fr1.scalingo.io"

  return (
    <AppContext.Provider value={{token, setToken, backend, username, setUsername, login, setLogin, count, setCount}}>
      <main> 
          {token ? <Accueil /> : <LoginView />}
      </main>
    </AppContext.Provider>
  )
}

export default App