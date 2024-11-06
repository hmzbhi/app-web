import { useContext } from "react"
import { AppContext } from "../AppContext"
import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"

function LoginView(){
  const {setToken, setUsername, setLogin, backend} = useContext(AppContext)
  
  async function onValidInfo(login, password){
    const reponse = await (await fetch( backend +"/login", 
      {
        method:'POST',
        headers:{'Content-type':'application/json'},
        body: JSON.stringify({email: login,password: password})
      })).json()
    
    setToken(reponse.token)
    setUsername(reponse.name)
    
    return reponse.status
  }

  async function registerRequest(name, loginR, password){
    const reponse = await (await fetch( backend +"/register", 
    {
      method:'POST',
      headers:{'Content-type':'application/json'},
      body: JSON.stringify({name: name, email: loginR,password: password})
    })).json()
    
    if (reponse.status) {
      setLogin(loginR)
    }

    return reponse.status
  }
  
  return (
    <>
      <LoginForm onValidInfo={onValidInfo}/>
      <RegisterForm registerRequest={registerRequest}/>
    </>
  )
}

export default LoginView