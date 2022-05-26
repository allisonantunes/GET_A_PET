import {useState, useContext} from 'react'

import Input from '../../form/Input'
import {Link} from 'react-router-dom'

import styles from '../../form/Form.module.css'

// context
import {Context} from '../../../context/UserContext'

function Login() {
    const [user, setUser] = useState({})
    const {login} = useContext(Context)

    function handleChange(e){
        setUser({...user, [e.target.name]: e.target.value})
    }

    // enviar para o back
    // <form onSubmit={handleSubmit}>
    function handleSubmit(e){
        e.preventDefault()
        login(user)
    }

    return (
        <section className={styles.form_container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input 
                text='E-mail'
                type='email'
                name='email'
                placeholder='Digite seu e-mail'
                handleOnChange={handleChange}
                />
                <Input 
                text='Senha'
                type='password'
                name='password'
                placeholder='Digite sua senha'
                handleOnChange={handleChange}
                />
                <input type='submit' value='Entrar' />
            </form>
            <p>
                Não tem conta? <Link to='/register'>Clique aqui</Link>
            </p>
        </section>
    )
}

export default Login
