import { useState, useContext } from 'react'
import { PropTypes } from 'prop-types'
import { AppContext } from '../AppContext'
import Button from './Button'
import Input from './Input'

function LoginForm({onValidInfo}){
    const {login, setLogin}= useContext(AppContext)
    const [password, setPassword] = useState("")
    const [invalid, setInvalid] = useState("")

    function message(){
        let erreurs = ["",""]
        if (!login.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          erreurs[0] += " Le login est incorrect."
        }
        if (password.length<6) {
          erreurs[1] += " Mot de passe trop court."
        }
        return erreurs
      }
    
      function connect(){
        if (message()[0].length===0 && message()[1].length===0) 
          onValidInfo(login,password).then(
          status => {
            if (!status) {
              setInvalid("Email/Mot de passe incorrect.")
            }
          }
        )
      }

    return (
      <fieldset className='login-field'>
        <legend>Se Connecter</legend>
          <ul>
            <li>
              <Input label="Email : " type="text" value={login} changeFunction={setLogin} incorrect={message()[0]} placeholder={"Email"}/>
            </li>
            <li>
              <Input label="Mot de passe : " type="password" value={password} changeFunction={setPassword} incorrect={message()[1]} placeholder={"Mot de passe"}/>
            </li>
          </ul>
          {invalid.length>0 && <span style={{color:"red"}}>{invalid}</span>}
          <Button title="OK" clickFunction={connect}/>
        </fieldset>
    )  
}

LoginForm.propTypes = {
  onValidInfo: PropTypes.func.isRequired
}

export default LoginForm