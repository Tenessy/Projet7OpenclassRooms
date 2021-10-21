import { BehaviorSubject, Observable, Subject } from "rxjs";
import { User } from "../models/user.model";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { pipe, from } from "rxjs";
import { map } from "rxjs/operators";
import { Edit } from "../models/edit.model";

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) { }

    private apiUrl: string = 'http://localhost:3000/api/auth';

    private users: User[] = [
        {
            firstName: 'teb',
            lastName: 'teb',
            password: 'cc',
            email: 'cc',
            userId: 2,

        }
    ];
    public utilisateurs: any[] = [];
    //  password: '2233'
    // email: 'james@smitch.com',
    userSubject = new Subject<User[]>();

    addNewUser(user: any[]) {
        from(user)
            .subscribe(
                data => {
                    console.log('Bonjour ' + data.firstName)
                    this.utilisateurs.push(data);
                    console.log(this.utilisateurs);
                });
    }
    getUser(id: number): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/user/${id}`)
    }
    editUser(id: any, data: any): Observable<Edit[]> {
        return this.http.put<Edit[]>(`${this.apiUrl}/user/${id}/edit`, data)
    }
    getInfoUser(id: any): Observable<Edit[]> {
        return this.http.get<Edit[]>(`${this.apiUrl}/user/${id}/edit`);
    }
    emitUsers() {
        this.userSubject.next(this.users.slice());
    }
    addUser(user: User) {
        console.log(user);
        this.users.push(user);
    }
    register(user: User): Observable<User[]> {
        return this.http.post<User[]>(`${this.apiUrl}/signup`, user)
    }
    login(email: string, password: string) {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
    }
}