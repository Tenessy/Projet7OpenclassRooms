import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree, UrlSegment } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import jwtDecode from "jwt-decode";



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
        private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const decoded = this.authService.authToken();
        const tokenUserId = decoded?.id;
        let currentUserId;
        this.authService.subject.subscribe(
            val => {
                currentUserId = val?.id;
            }
        );
        if (tokenUserId === currentUserId) {
            return true;
        }
        else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}