import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { confirmPasswordvalidator } from '../../../app/validators/confirmPassword.validator';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService, // Inject ToastrService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: confirmPasswordvalidator('password', 'confirmPassword')
    });
  }

  register() {
    this.authService.registerService(this.registerForm.value)
      .subscribe({
        next: (res: any) => {
          this.toastr.success('User Created!', 'Success'); // Show success message
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          console.log(err);
          if (err.status === 400 && err.error.message === 'You are already registered') {
            this.toastr.warning('User already registered. Please log in.', 'Warning'); // Show warning message
          } else {
            this.toastr.error('An error occurred. Please try again later.', 'Error'); // Show error message
          }
        }
      });
  }
}

