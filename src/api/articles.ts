import {request} from "./request";

export function getArticles(params: any) {
    return request({
        url: '/articles',
        method: 'GET',
        params,
    })
}

export function getArticleDetail(id: any) {
    return request({
        url: `/articles/${id}`,
        method: 'GET',
    })
}

export function addViews(data: any) {
    return request({
        url: `/articles/addViews`,
        method: 'PUT',
        data,
    })
}

export function addLikes(data: object) {
    return request({
        url: `/articles/addLikes`,
        method: 'PUT',
        data,
    })
}