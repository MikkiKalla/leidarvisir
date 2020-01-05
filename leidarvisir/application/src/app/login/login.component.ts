import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onLoginButtonClick(UserName: string, password: string){
    console.log(UserName, password);
    
    this.authService.login(UserName, password).subscribe((res: HttpResponse<any>) => {
      console.log(res);
    });
  }

}
