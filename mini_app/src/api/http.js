import axios from 'axios';

export const http = axios.create({
  baseURL:
    import.meta.env.VITE_SW_API_BASE || "https://thronesapi.com/api/v2",
  timeout: 10000, //si la api tarda más axios saca un error de timeout
});


http.interceptors.response.use(
    (res) => res,
    (error)  =>{
        if(axios.isCancel?.(error) || error.code === "ERR_CANCELED" || error.name === "CanceledError"){
    
            return Promise.reject({ canceled: true });
        }
        const status = error?.response?.status ?? 0; //Si no hay respuesta del servidor (sin conexión) status 0
        const message = error?.response?.data?.message || error.message || "Error de red";
        return Promise.reject({status, message});
    })