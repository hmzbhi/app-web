import { PropTypes } from 'prop-types'
function ListGroups({groups, setCurrGroup, setCurrGroupM}){
  return (
    <ul className='list-groups'>
      {groups.map((group, index) => (
      <li key={index}onClick={() => {
        setCurrGroup(null)
        setCurrGroupM(group)
      }}> {group.name}</li>
    ))}
    </ul>
  )
}

ListGroups.propTypes = {
    groups: PropTypes.array.isRequired,
    setCurrGroup: PropTypes.func.isRequired,
    setCurrGroupM: PropTypes.func.isRequired
}

export default ListGroups