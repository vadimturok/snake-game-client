import React, {useState} from 'react'
import './inputField.css'
import {createUser} from "../../services";

const InputField = ({setUser}) => {
    const [name, setName] = useState('')
    const [error, setError] = useState('')

    const submitInput = async () => {
        setError('')
        const response = await createUser(name)
        if(typeof response === 'string'){
            setError(response)
            return;
        }
        localStorage.setItem('user', JSON.stringify(response))
        setUser(response)
    }
    return (
        <div className={'inputWrapper'}>
            <h3 className={'textHelp'}>Enter your name</h3>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={'input'}
            />
            <button disabled={name.length === 0} onClick={submitInput} className={'submitButton'}>Submit</button>
            {error && <div className={'error'}>{error}</div>}
        </div>
    )
}
export default InputField