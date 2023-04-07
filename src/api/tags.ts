import {request} from "./request";

export function getTags(params: any) {
    return request({
        url: '/tags',
        method: 'GET',
        params,
    })
}

export function getArticlesByTags(data: any) {
    return request({
        url: '/articles/byTags',
        method: 'POST',
        data,
    })
}