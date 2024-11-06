import { useContext, useState } from "react"
import { AppContext } from "../AppContext"
import { PropTypes } from 'prop-types'
import ListMessages from './ListMessages'
import Input from './Input'
import Button from './Button'


function GroupMessage({group}){

  const {token, backend, count, setCount} = useContext(AppContext)
  const [content, setContent] = useState("")

  function requestMessage(){
    fetch(backend + "/api/messages/" + group.id, {
      method: 'POST',
      headers:{
        'Content-type':'application/json',
        "x-access-token": token},
      body: JSON.stringify({content: content})
    })
      .then(resp => resp.json())
      .then(resjson => {if (resjson.status){
        setCount(count + 1)
        setContent("")
      }
      })
  }

  return (
    <>
    {group && 
      <fieldset id="list-messages">
      <legend>Discussion sur le groupe {group.name}</legend>
      <ListMessages gid={group.id}/>
      <hr/><hr/>
      <Input label={""} type={"text"} value={content} changeFunction={setContent} incorrect={""} placeholder={"Contenu du message"} />
      <Button title={"Envoyer"} clickFunction={requestMessage}/>
    </fieldset>
    }
    </>
  )
}

GroupMessage.propTypes = {
  group: PropTypes.object
}

export default GroupMessage