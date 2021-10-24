import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../models/post.model";

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

    newPost(data: any): Observable<any> {
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
   
}