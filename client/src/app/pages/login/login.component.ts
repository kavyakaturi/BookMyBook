import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,private authService: AuthService,private router:Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    this.authService.loginService(this.loginForm.value)
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Login Successful', 'Success', {
            timeOut: 2000
          });
          localStorage.setItem("user_id", res.data._id);
          this.authService.isLoggedIn$.next(true);
          this.router.navigate(['/home']);
          this.loginForm.reset();
        },
        error: (err: any) => {
          console.log(err);
          this.toastr.error(err.error, 'Error', {
            timeOut: 3000
          });
        }
      });
  }
}

