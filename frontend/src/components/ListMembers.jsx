import { useState, useEffect, useContext } from "react"
import { PropTypes } from 'prop-types'
import { AppContext } from "../AppContext"
import Button from "./Button"

function ListMembers({gid}){
  const { backend, token, count,setCount } = useContext(AppContext)
  const [members, setMembers] = useState([])
  const [erreur, setErreur] = useState("")
    
  useEffect(()=>{
    fetch(backend + "/api/mygroups/" + gid, {headers:{"x-access-token": token}})
    .then(resp => resp.json())
    .then(resjson => setMembers(resjson.data))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[gid, count])

  useEffect(()=>{
    setErreur("")
  }, [gid])

  function removeMember(uid){
    fetch(backend + "/api/mygroups/" + gid + "/" + uid, {
      method: 'DELETE',
      headers:{
        'Content-type':'application/json',
        "x-access-token": token},
    })
      .then(resp => resp.json())
      .then(resjson => {
        if (resjson.status){
          setCount(count + 1)
          setErreur(" Membre supprimé")
        } else {
          setErreur(" Erreur de suppression")
        }
      })
  }

  return (
    <>  
      <h3>Liste les membres</h3>
      <ul className="list-members">
      {members.map((member, index) => (
        <li key={index}> 
          {member.email}
          <Button title={"Supprimer"} clickFunction={() => removeMember(member.id)}/>
        </li>
    ))}
    </ul>
    {erreur===" Membre supprimé" && <span style={{color:"green"}}>{erreur}</span>}
    {erreur===" Erreur de suppression" && <span style={{color:"red"}}>{erreur}</span>}
    </>
  )
}

ListMembers.propTypes = {
  gid: PropTypes.number.isRequired
}

export default ListMembers