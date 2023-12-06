import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import {map, tap, shareReplay} from "rxjs/operators"
import { User } from "../model/user"; 
import { HttpClient } from "@angular/common/http";

const AUTH_DATA = "auth_data";

@Injectable({
    providedIn: 'root'
})
export class AuthStore{
private subject = new BehaviorSubject<User>(null);
user$: Observable<User> = this.subject.asObservable();
isLoggedIn$: Observable<boolean>;
isLoggedOut$:  Observable<boolean>;

constructor(private http: HttpClient){
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));

    const user = localStorage.getItem(AUTH_DATA);
    if(user){
        this.subject.next(JSON.parse(user));
    }
}

login(email: string, password: string): Observable<User>{
    return this.http.post<User>("/api/login", {email, password})
    .pipe(
        tap(user => {
            localStorage.setItem(AUTH_DATA, JSON.stringify(user))
            this.subject.next(user);
        }),
        shareReplay()
    );
}

logout(){
    this.subject.next(null);
    localStorage.removeItem(AUTH_DATA);
}
}