import { PropTypes } from 'prop-types';

function Input( {label, type, value, changeFunction, incorrect, placeholder} ) {
    return (
        <>
            {label && <label>{label}</label>}
            <input
                type={type}
                value={value}
                onChange={(e)=>changeFunction(e.target.value)}
                placeholder={placeholder}
            />
            {incorrect && <span style={{color:"red"}}>{incorrect}</span>}      
        </>
    )
}

Input.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    changeFunction: PropTypes.func.isRequired,
    incorrect: PropTypes.string,
    placeholder: PropTypes.string
  }

export default Input