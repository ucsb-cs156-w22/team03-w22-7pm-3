import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'

export function onPurgeSuccess(message) {
    console.log(message);
    toast(message);
}

export function cellToAxiosParamsPurge() {
    return {
        url: "/api/earthquakes/purge",
        method: "DELETE",
    }
}

