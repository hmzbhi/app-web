import { useState, useContext, useEffect } from 'react'
import { PropTypes } from 'prop-types'
import { AppContext } from '../AppContext'

function ListMessages({gid}){
  const { backend, token, username } = useContext(AppContext)
  const [messages, setMessages] = useState([])

  function majMessages(gid){
    fetch(backend + "/api/messages/" + gid, {headers:{"x-access-token": token}}) 
    .then(res => res.json())
    .then(resjson => setMessages(resjson.data))
  }

  useEffect(()=>{
    majMessages(gid)
    const timerID = setInterval(majMessages, 5000, gid)
    return (()=>clearInterval(timerID))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gid])

  return (
    <div id='deroulant'>
      <ul id="on-left">
        {messages.map((message, index) => (
          <li key={index} className={message.name === username ? "mine-message" : "other-message"}>
            <div className="message-content">{message.content}</div>
            {message.name !== username && <div className="message-author">{message.name}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}

ListMessages.propTypes = {
    gid: PropTypes.number.isRequired
}

export default ListMessages