import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (state.url == '/conferencia') {
            window.location.href = 'https://us02web.zoom.us/j/87113142474';
            return false
        }
        if (this.userService.isLogined()) {
            if (state.url == '/') {
                this.router.navigate(['/member/dashboard']);
                return false;
            }
            return true;
        }
        else {
            if (state.url == '/') return true;
            this.router.navigate(['/']);
            return false;
        }
    }
}
