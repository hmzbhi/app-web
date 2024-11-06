import { useContext } from "react"
import { AppContext } from "../AppContext"
import MyGroups from "./MyGroups"
import Button from "../components/Button"

function Accueil() {
  const { username, setToken } = useContext(AppContext)

  function disconnect(){
    setToken(null)
  }

  return (
    <>
      <div className="disconnect">
        <Button title={"Se deconnecter"} clickFunction={disconnect}/>
      </div>
      <div className="accueil">
        <h2>Re-Bonjour {username} </h2>
        <MyGroups />
      </div>
    </>
  )
}

export default Accueil