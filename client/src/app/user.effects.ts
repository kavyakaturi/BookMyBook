import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../app/services/user-service.service';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.loadUsers),
    mergeMap(() => {
      return this.userService.getUsers()
        .pipe(
          map(users => {
            console.log('Users Fetched:', users);
            return UserActions.loadUsersSuccess({ users });
          }),
        );
    })
  ));

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}
