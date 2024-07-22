import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,private authService: AuthService) { }

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  submit(){
      this.authService.sendEmailService(this.forgotForm.value.email)
      .subscribe({
        next:(res)=>{
          alert(res.message);
          this.forgotForm.reset();
        },
        error: (err)=>{
           alert(err.error.message);
        }
      })
  }

}
