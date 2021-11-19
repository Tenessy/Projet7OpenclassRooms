import { Observable, Subject } from "rxjs";
import { User } from "../models/user.model";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { from } from "rxjs";
import { Edit } from "../models/edit.model";

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) { }

    private apiUrl: string = 'http://localhost:3000/api/auth';

    register(user: User): Observable<User[]> {
        return this.http.post<User[]>(`${this.apiUrl}/signup`, user)
    }
    login(email: string, password: string) {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
    }
    getUser(id: number): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/user/${id}`)
    }
    editUser(id: any, data: any): Observable<Edit[]> {
        return this.http.put<Edit[]>(`${this.apiUrl}/user/${id}/edit`, data)
    }
    deleteOneUser(id: any) {
        return this.http.delete(`${this.apiUrl}/user/${id}/edit`);
    }
    getInfoUser(id: any): Observable<Edit[]> {
        return this.http.get<Edit[]>(`${this.apiUrl}/user/${id}/edit`);
    }
}