import { PropTypes } from 'prop-types';

function Button({title, clickFunction }) {
    return (
        <button onClick={clickFunction}> {title} </button>
    )
}

Button.propTypes = {
    title: PropTypes.string.isRequired,
    clickFunction: PropTypes.func.isRequired
  }

export default Button