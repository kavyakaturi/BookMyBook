import { createReducer, on } from '@ngrx/store';
import { User } from './user.model';
import * as UserActions from './user.actions';

export interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: []
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsersSuccess, (state, { users }) => {
 
    console.log('Users to be added:', users); 
    const newState = { ...state, users };
    return newState;
  }),
  on(UserActions.updateUsers, (state, { users }) => {
    console.log('Updated Users:', users); 
    const newState = { ...state, users };
    return newState;
  })
);

