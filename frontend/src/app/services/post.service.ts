import { BehaviorSubject, Observable, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../models/post.model";

@Injectable({
    providedIn: 'root'
})
export class PostService {
    public postsSubject: Subject<boolean>;
    constructor(private http: HttpClient) {
        this.postsSubject = new Subject<boolean>();
    }
    posts: Post[] = [];
    deletedPost = new BehaviorSubject<boolean>(false);
    apiHost: string = 'http://localhost:3000/api';

    getPostsFromServer() {
        return this.http.get<Post[]>(`${this.apiHost}/forum`);
    }
    newPost(post: Post) {
        const apiUrl = `${this.apiHost}/forum`;
        return this.http.post<Post>(apiUrl, post, {
            reportProgress: true,
            observe: 'events'
        });
    }
    getPost(id: number): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiHost}/forum/${id}`);
    }
    deletePost(post: Post) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { post_id: post.id }
        };
        return this.http.delete(`${this.apiHost}/forum`, options);
    }
    postOneComment(id: number, comment: string) {
        return this.http.post(`${this.apiHost}/forum/${id}/comment`, comment);
    }
    getAllComments() {
        return this.http.get(`${this.apiHost}/forum/comment`);
    }
    getCommentsOnePost(id: number) {
        return this.http.get(`${this.apiHost}/forum/${id}/comment`);
    }
    deleteOneComment(comment: any, id: number) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { comment: comment }
        };
        return this.http.delete(`${this.apiHost}/forum/${id}/comment`, options);
    }
    updatePost(post: Post) {
        return this.http.put(`${this.apiHost}/forum`, post);
    }
    postLike(like: any) {
        return this.http.post(`${this.apiHost}/forum/likes`, like);
    }
    getLikes() {
        return this.http.get(`${this.apiHost}/forum/like/user`);
    }
    deleteLike(like: any) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: like
        };
        return this.http.delete(`${this.apiHost}/forum/like/user`, options);
    }

}