import {request} from "./request";

export function getCategories(params: any) {
    return request({
        url: '/categories',
        method: 'GET',
        params,
    })
}

export function getArticlesByCategories(data: any) {
    return request({
        url: '/articles/byCategories',
        method: 'POST',
        data,
    })
}