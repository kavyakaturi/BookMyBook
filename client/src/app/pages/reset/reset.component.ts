import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  resetForm!: FormGroup;
  token! : string

  constructor(private formBuilder: FormBuilder,private router: Router,private activatedRoute : ActivatedRoute,private authService: AuthService) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val=>{
      this.token = val['token'];
      console.log(this.token);
    })
    this.resetForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  reset() {
    let resetObj = {
      token: this.token,
      password: this.resetForm.value.password
    }
    this.authService.resetPasswordService(resetObj)
    .subscribe({
      next: (res)=>{
        alert(res.message);
        this.resetForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err) =>{
        alert(err.error.message);
      }
    })
    }
  }


