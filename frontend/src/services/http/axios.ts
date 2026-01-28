//Axios Instance
import axios from "axios"
import config from "../../utils/envConfig"


export const api = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
    headers: {
        "ngrok-skip-browser-warning": "69420", // Bypasses the ngrok interstitial page
    }
})