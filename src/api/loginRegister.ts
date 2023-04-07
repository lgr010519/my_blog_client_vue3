import {request} from "./request";

export function login(data: any) {
    return request({
        url: '/user/login',
        method: 'POST',
        data,
    })
}

export function getCaptcha() {
    return request({
        url: '/user/captcha',
        method: 'GET',
    })
}

export function register(data: any) {
    return request({
        url: '/user/register',
        method: 'POST',
        data,
    })
}

export function logout() {
    return request({
        url: '/admin/logout',
        method: 'POST',
    })
}