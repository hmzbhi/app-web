import {useState} from 'react'
import { PropTypes } from 'prop-types'
import Button from './Button'
import Input from './Input'

function RegisterForm({registerRequest}){

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [loginR, setLoginR] = useState("")
    const [invalid, setInvalid] = useState("")

    function message(){
      let erreurs = ["","",""]
      if (!loginR.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        erreurs[0] += "Le login est incorrect."
      }
      if (!(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password))) {
        erreurs[1] += " Mot de passe faible."
      }
      if (password!==password2) {
        erreurs[2] += " Les mots de passe ne correspondent pas."
      }

      return erreurs
    }

    function register(){
      if (message()[0].length===0 && message()[1].length===0 && password===password2){
        registerRequest(name,loginR,password).then(
          status => {
          if (status) {
            setName("")
            setPassword("")
            setLoginR("")
            setPassword2("")
            setInvalid("Enrigistrement effectué")
          }
          else {
            setInvalid("Erreur lors de l'enregistrement")
          }
          }
        )
      }
    }

    return (
      <fieldset className='register-field'>
        <legend> Pas encore de compte Enregistrez vous</legend>
          <ul>
            <li>
              <Input label="Nom : " type="text" value={name} changeFunction={setName} placeholder={"Nom"} />
            </li>
            <li>
              <Input label="Email : " type="text" value={loginR} changeFunction={setLoginR} incorrect={message()[0]} placeholder={"Email"}/>
            </li>
            <li>
              <Input label="Mot de passe : " type="password" value={password} changeFunction={setPassword} incorrect={message()[1]} placeholder={"Mot de passe"}/>
            </li>
            <li>
              <Input label="Confirmer Mot de passe : " type="password" value={password2} changeFunction={setPassword2} incorrect={message()[2]} placeholder={"Mot de passe"}/> 
            </li>
          </ul>
        {invalid==="Erreur lors de l'enregistrement" && <span style={{color:"red"}}>{invalid}</span>}
        {invalid==="Enrigistrement effectué" && <span style={{color:"green"}}>{invalid}</span>}
        <Button title="OK" clickFunction={register}/>
      </fieldset>
    )
}

RegisterForm.propTypes = {
  registerRequest: PropTypes.func.isRequired
}

export default RegisterForm