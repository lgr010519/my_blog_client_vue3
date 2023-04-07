import {request} from "./request";

export function getAboutInfo() {
    return request({
        url: '/about',
        method: 'GET',
    })
}