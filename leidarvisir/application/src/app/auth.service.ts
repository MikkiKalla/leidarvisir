import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import{ shareReplay, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private webService: WebRequestService, private router: Router) { }
  login(UserName: string, password: string){
    return this.webService.login(UserName, password).pipe(
      //check the docs. good for essay
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        //headers will be stored in localStorage
        this.setSession(res.body._id, res.headers.get("x-access-token"), res.headers.get("x-refresh-token"));
        console.log("succesfully Logged in"); 
        
      })
      )
    }
    logout(){
      this.removeSession();
      console.log("You have been logged out");
  }
  
  getAccessToken(){
    return localStorage.getItem("x-access-item");
  }

  getRefreshToken(){
    return localStorage.getItem("x-refresh-token");
  }
  setAccessToken(accessToken: string){
    localStorage.setItem("x-access-token", accessToken);
  }

  //*** LOGIN Method ***
  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem("user_id", userId)
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
  }
  //*** LOGOUT Method ***
  private removeSession() {
    localStorage.removeItem("user_id")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }

}
