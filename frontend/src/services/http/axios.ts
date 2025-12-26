//Axios Instance
import axios from "axios"
import config from "../../utils/envConfig"


export const api = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
})