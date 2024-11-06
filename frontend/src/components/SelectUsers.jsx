import { PropTypes } from 'prop-types'
import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../AppContext'
import Button from './Button'

function SelectUsers({label, gid}){

  const { backend, token, count, setCount } = useContext(AppContext)

  const [users, setUsers] = useState([])
  const [erreur, setErreur] = useState("")
  const [uid, setUid] = useState("")
    
  useEffect(()=>{
    fetch(backend + "/api/users", {headers:{"x-access-token": token}})
    .then(resp => resp.json())
    .then(resjson => setUsers(resjson.data))
    setErreur("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[gid])

  function addMember(){
    fetch(backend + "/api/mygroups/" + gid + "/" + uid, {
      method: 'PUT',
      headers:{
        'Content-type':'application/json',
        "x-access-token": token},
    })
      .then(resp => resp.json())
      .then(resjson => {if (resjson.status){
        setCount(count + 1)
        setErreur(" Membre ajouté")
      } else {
        setErreur(" Déjà ajouté")
      }
      })
  }

  return (
    <>
      <Button title={"Ajouter"} clickFunction={addMember} />
      <div>
        <label>{label}</label>
      </div>
      <select onChange={(e) => setUid(e.target.value)}>
        <option value="">--Choose a user--</option>
        {users.map((user, index) => (
        <option value={user.id} key={index}> {user.email}</option>
    ))}
      </select>
      {erreur===" Déjà ajouté" && <span style={{color:"red"}}>{erreur}</span>}
      {erreur===" Membre ajouté" && <span style={{color:"green"}}>{erreur}</span>}
    </>
  )
}

SelectUsers.propTypes = {
  label: PropTypes.string.isRequired,
  gid: PropTypes.number.isRequired
}

export default SelectUsers