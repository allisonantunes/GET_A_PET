// receber dados de forma dinamica

import styles from './Input.module.css'
/*
 oque tem no input. type = text, number, date... text = label (nome do input)...name = nome do atributo, age, id... handleOnChange = mudança do estado do componete... onChange = monitorar eventos de mudança... multiple = imagespet
 */

function Input({
    type,
    text,
    name,
    placeholder,
    handleOnChange,
    value,
    multiple,
    }) {

    return (
      <div className={styles.form_control}>
        <label htmlFor={name}>{text}:</label>
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          onChange={handleOnChange}
          value={value}
          {...(multiple ? { multiple } : '')}
        />
      </div>
    )
  }
  
  export default Input