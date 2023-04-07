import {request} from "./request";

export function getCommentList(params: any) {
    return request({
        url: '/comment',
        method: 'GET',
        params,
    })
}

export function comment(data: any) {
    return request({
        url: '/comment',
        method: 'POST',
        data,
    })
}