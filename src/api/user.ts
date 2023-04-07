import {request} from "./request";

export function updateUserInfo(data: any) {
    return request({
        url: '/user',
        method: 'PUT',
        data,
    })
}

export function getUserInfo(params: any) {
    return request({
        url: '/user/info',
        method: 'GET',
        params,
    })
}

export function updateUserCollectNum(data: any) {
    return request({
        url: '/user/collect',
        method: 'POST',
        data,
    })
}

export function getCollectArticles(data: any) {
    return request({
        url: '/articles/byIds',
        method: 'POST',
        data,
    })
}