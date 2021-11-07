import { Observable, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../models/post.model";
import { of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostService {

    postSubject = new Subject<any[]>();
    apiHost: string = 'http://localhost:3000/api'

    constructor(private http: HttpClient) { }

    getPost(id: number): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiHost}/forum/${id}`);
    }

    getPostsFromServer() {
        return this.http.get<any[]>(`${this.apiHost}/forum`);
    }

    newPost(data: any) {
        const apiUrl = `${this.apiHost}/forum`;
        return this.http.post<any>(apiUrl, data, {
            reportProgress: true,
            observe: 'events'
        });
    }
    postOnePostComment(id: any, comment: any): Observable<Post[]> {
        return this.http.post<Post[]>(`${this.apiHost}/forum/${id}/comment`, comment);
    }
    getCommentsOnePost(id: any) {
        return this.http.get(`${this.apiHost}/forum/${id}/comment`);
    }
    updatePost(data: any) {
        return this.http.put(`${this.apiHost}/forum`, data);
    }
    postLikes(data: any) {
        return this.http.post(`${this.apiHost}/forum/likes`, data);
    }
    getLikes() {
        return this.http.get(`${this.apiHost}/forum/like/user`);
    }
    deleteUserIdLikes(post: any) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { post: post }
        };
        return this.http.delete(`${this.apiHost}/forum/like/user`, options);
    }

}