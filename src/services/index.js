import {api} from "../http";

export const createUser = async (name) => {
    try{
        const response = await api.post('/user', {name})
        return response.data
    }catch(e){
        return e.response.data.message
    }
}

export const setNewRecord = async (points, name) => {
    try{
        const response = await api.put('/user', {name, points})
        console.log('Response: ', response)
    }catch(e){
        console.log('Error updating record: ', e.response.data.message)
    }
}

export const getUserByName = async (name) => {
    try{
        const response = await api.get(`/user/${name}`)
        return response
    }catch(e){
        console.log('Error getting user', e)
    }
}

export const getRecordHolders = async () => {
    try{
        const response = await api.get('/user/top')
        return response
    }catch(e){
        console.log('Error getting record holders', e)
    }
}