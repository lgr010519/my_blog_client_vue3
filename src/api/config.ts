import {request} from "./request";

export function getHomeInfo() {
    return request({
        url: '/config/home',
        method: 'GET',
    })
}