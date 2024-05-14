function InputField(props) {
  return (
    <div className="container_input_rapport">
      <input
        className="input_dossier"
        name={props.name}
        id={props.name}
        required
      ></input>
      <label className="label_rapport" htmlFor={props.name}>
        {props.label}
      </label>
    </div>
  )
}
