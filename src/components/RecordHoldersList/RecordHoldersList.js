import React, {memo, useEffect, useState} from 'react'
import './recordHoldersList.css'
import {getRecordHolders} from "../../services";

const RecordHoldersList = memo(() => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        async function getData(){
            const response = await getRecordHolders()
            setUsers(response.data)
        }
        getData()
    }, [])
    return (
        <div className={'recordWrapper'}>
            <h1 className={'recordTitle'}>Top 10</h1>
            <div className={'recordList'}>
                {users.length > 0 && users.map((user, index) =>
                    <div className={'recordItem'} key={user.name}>
                        <span className={'number'} style={{
                            backgroundColor: index === 0 ? 'gold' : ''
                        }}>{index+1}</span> {user.name} - {user.recordPoints}
                    </div>
                )}
            </div>
        </div>
    )
})

export default RecordHoldersList