import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user-service.service';
import { loadUsers, updateUsers } from 'src/app/user.actions';
import { User } from 'src/app/user.model';
import { selectAllUsers } from 'src/app/user.selector';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users$!: Observable<User[]>;
  newName: string = '';

  constructor(private store: Store<{ users: User[] }>) {}

  ngOnInit() {
    this.store.dispatch(loadUsers());
    this.users$ = this.store.pipe(select(selectAllUsers));
    
    this.users$.subscribe(users => {
      console.log(users);
    });
  }
  
  updateUserName(user: User, newName: string) {
   
    const updatedUser = { ...user, name: newName }; 
    this.store.dispatch(updateUsers({ users: [updatedUser] })); 
    console.log('New name value:', newName);
}
}
