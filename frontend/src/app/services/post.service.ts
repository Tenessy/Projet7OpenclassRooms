import { interval, Observable, Subject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { catchError } from "rxjs/operators";
import { Post } from "../models/post.model";
import { forkJoin } from "rxjs";




@Injectable({
    providedIn: 'root'
})
export class PostService {

    postSubject = new Subject<any[]>();
    apiHost: string = 'http://localhost:3000/api'

    private posts = [
        {
            id: 1,
            userName: 'Tenessy',
            texte: "Bienvenue sur le site de groupomania, permettant un échange",
            imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
            date: new Date(),
            like: 10,
            commentaires: 29
        },
        {
            id: 2,
            userName: "Sébastien",
            texte: "éteint",
            imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
            like: 10,
            date: new Date(),
            commentaires: 29
        },
        {
            id: 3,
            userName: "Fabrice",
            texte: "allumé",
            imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
            like: 10,
            date: new Date(),
            commentaires: 29
        }
    ];
    constructor(private http: HttpClient) { }

    emitPostSubject() {
        this.postSubject.next(this.posts.slice());
    }

    getPostById(id: number) {
        const post = this.posts.find(
            (postObject) => {
                return postObject.id === id;
            }
        );
        return post!;
    }
    getPost(id: number) {
        return this.http.get(`http://localhost:3000/api/forum/${id}`);
    }

    addPost(texte: string, imageUrl: string) {
        const postObject = {
            id: 0,
            userName: 'Jean',
            texte: '',
            imageUrl: '',
            date: new Date(),
            like: 0,
            commentaires: 0
        };
        postObject.texte = texte;
        postObject.imageUrl = imageUrl;
        postObject.id = this.posts[(this.posts.length - 1)].id + 1;
        this.posts.push(postObject);
        this.emitPostSubject();
    }

    newPost(data: any): Observable<any> {
        const apiUrl = `${this.apiHost}/forum`;
        return this.http.post<any>(apiUrl, data, {
            reportProgress: true,
            observe: 'events'
        });
    }

    savePostsToServer(post: Post): Observable<Post[]> {
        let apiUrl = `${this.apiHost}/forum`;
        return this.http.post<any[]>(apiUrl, post)
    }

    getPostsFromServer() {
        return this.http.get<any[]>(`${this.apiHost}/forum`);
    }
    getUserFromServer() {
        return this.http.get<any[]>(``)
    }
}