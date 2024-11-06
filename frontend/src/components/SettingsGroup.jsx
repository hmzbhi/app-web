import { PropTypes } from 'prop-types'
import SelectUsers from './SelectUsers'
import ListMembers from './ListMembers'

function SettingsGroup({group}){
  return (
    <>
    {group && 
      <fieldset id='on-left'>
      <legend> Administration {group.name}</legend>
      <SelectUsers label={"Ajouter un membre"} gid={group.id}/>
      <hr></hr>
      <ListMembers gid={group.id}/>
    </fieldset>
    }
    </>
  )
}

SettingsGroup.propTypes = {
  group: PropTypes.object
}

export default SettingsGroup