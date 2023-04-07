import axios from "axios";
import router from "../router";

export const request = (config: any) => {
    const http = axios.create({
        baseURL: 'http://127.0.0.1:7001/api/v1',
        // timeout: 5000,
    })

    // 请求拦截
    http.interceptors.request.use((config) => {
        if (config.method === 'put' || config.method === 'delete') {
            const id = config.data._id || config.data.id
            config.url += `/${id}`
        }
        const token = localStorage.getItem('token')
        // @ts-ignore
        config.headers = {
            Authorization: 'Bearer ' + token
        }
        return config
    }, (error) => {
        console.log('requestError', error)
    })
    // 响应拦截
    http.interceptors.response.use((res) => {
        return res.data ? res.data : res
    }, (error) => {
        console.log('responseError', error.response)
        if (error.response && error.response.status === 401) {
            // Vue.$toast.error("登录状态过期，请重新登录");
            localStorage.removeItem('userInfo')
            router.push('/home')
        }
    })

    return http(config)
}