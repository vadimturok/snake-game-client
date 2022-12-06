import React, {useState} from 'react'
import GameField from "./components/GameField/GameField";
import InputField from "./components/InputField/InputField";
import RecordHoldersList from "./components/RecordHoldersList/RecordHoldersList";

const App = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

    return (
        <div>
            {user ? <GameField user={user}/> : <InputField setUser={setUser}/>}
            <RecordHoldersList/>
        </div>
    )
}
export default App