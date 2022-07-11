

const RadioInput = (props) => {
  const { label, name, value, onChange } = props
  return (
    <div className="form-check mt-2">
      <input
        className="form-check-input"
        type="radio"
        name={name}
        onChange={(val) => onChange(val)}
        checked={value}
      />
      {label && <label className="form-check-label" htmlFor="checkbox-switch-2">{label}</label>}
    </div>
  )
}

export default RadioInput