import { useContext, useState, useEffect } from "react"
import { AppContext } from "../AppContext"
import Input from "../components/Input"
import Button from "../components/Button"
import ListGroups from "../components/ListGroups"
import ListGroupsOwn from "../components/ListGroupsOwn"
import SettingsGroup from "../components/SettingsGroup"
import GroupMessage from "../components/GroupMessage"

function MyGroups(){
  const {token, backend, count, setCount} = useContext(AppContext)
  
  const [groupName, setGroupName] = useState("")
  const [erreur, setErreur] = useState("")
  
  const [groups, setGroups] = useState([])
  const [groupsOwn, setGroupsOwn] = useState([])

  const [currGroup, setCurrGroup] = useState(null)
  const [currGroupM, setCurrGroupM] = useState(null)

  useEffect(()=>{
    fetch(backend + "/api/groupsmember", {headers:{"x-access-token": token}})
    .then(resp => resp.json())
    .then(resjson => setGroups(resjson.data))

    fetch(backend + "/api/mygroups", {headers:{"x-access-token": token}})
    .then(resp => resp.json())
    .then(resjson => setGroupsOwn(resjson.data))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[count])

  function requestCreate(){
    fetch(backend + "/api/mygroups", {
      method: 'POST',
      headers:{
        'Content-type':'application/json',
        "x-access-token": token},
      body: JSON.stringify({name: groupName})
    })
      .then(resp => resp.json())
      .then(resjson => {if (resjson.status){
        setCount(count + 1)
        setGroupName("")
      } else {
        setErreur("Réessayez")
      }
      })
  }
  return (
    <>
    <fieldset>
      <legend>Mes groupes</legend>
      
      <h3> Ceux dont je suis membre</h3>
      <ListGroups groups={groups} setCurrGroup={setCurrGroup} setCurrGroupM={setCurrGroupM}/>
      
      <hr></hr>
      
      <h3> Ceux que j&#39;administre</h3>
      <ListGroupsOwn groupsOwn={groupsOwn} setCurrGroup={setCurrGroup} setCurrGroupM={setCurrGroupM}/>
      
      <Input label={""} type={"text"} value={groupName} changeFunction={setGroupName} incorrect={erreur} placeholder={"nom du nouveau groupe"} />
      <Button title={"Créer"} clickFunction={requestCreate}/>
    </fieldset>
    <SettingsGroup group={currGroup} />
    <GroupMessage group={currGroupM} />
    </>
  )

}

export default MyGroups