import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '../api.urls';
import { Observable, catchError, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8800/api/user/getAll';
  private cardsUrl = 'http://localhost:8800/api/card/getCards'; 

  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private loggedInKey = 'isLoggedIn';

  constructor(private http : HttpClient) { }

  registerService(registerObj: any){
    return this.http.post<any>(`${apiUrls.authServiceApi}register`,registerObj);
  }

  loginService(loginObj: any): Observable<any> {
    return this.http.post<any>(`${apiUrls.authServiceApi}login`, loginObj).pipe(
      tap((res: any) => {
        localStorage.setItem("user_id", res.data._id);
        localStorage.setItem("username", res.data.username); 
        localStorage.setItem(this.loggedInKey, 'true'); 
        this.isLoggedIn$.next(true);
      })
    );
  }
  
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  sendEmailService(email:string){
    return this.http.post<any>(`${apiUrls.authServiceApi}sendEmail`,{email: email});
  }

  resetPasswordService(resetObj:any){
    return this.http.post<any>(`${apiUrls.authServiceApi}resetPassword`,resetObj);
  }
  isLoggedIn(){
    return !!localStorage.getItem("user_id");
  }

  getCards(): Observable<any[]> {
    return this.http.get<any[]>(this.cardsUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching cards:', error);
          throw error;
        })
      );
  }
}



