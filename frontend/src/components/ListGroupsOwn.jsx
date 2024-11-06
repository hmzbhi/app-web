import { PropTypes } from 'prop-types'

function ListGroupsOwn({groupsOwn, setCurrGroup, setCurrGroupM}){
  return (
    <ul className='groups-admin'>
      {groupsOwn.map((group, index) => (
      <li key={index} onClick={() => {
        setCurrGroup(group)
        setCurrGroupM(null)
      }}> {group.name}</li>
    ))}
    </ul>
  )
}

ListGroupsOwn.propTypes = {
  groupsOwn: PropTypes.array.isRequired,
  setCurrGroup: PropTypes.func.isRequired,
  setCurrGroupM: PropTypes.func.isRequired

}

export default ListGroupsOwn