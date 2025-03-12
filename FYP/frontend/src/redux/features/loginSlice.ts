import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  value: LoginState;
}

interface LoginState  {
  isLoggedIn: boolean,
  username: string,
  email:  string, 
  birthday:  string, 
  uid:  string, 
}

interface Action {
  username: string,
  email:  string, 
  birthday:  string, 
}

const initialState = {
  value:{
    isLoggedIn: false,
    username: "",
    email:  "", 
    birthday:  "", 
    uid:  "", 
  }as LoginState, 
} as InitialState;

export const login = createSlice({
  name: "login",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (_, action: PayloadAction<Action>) => {
      return {
        value:{
          isLoggedIn:true,
          username: action.payload.username,
          email: action.payload.email,
          birthday: action.payload.birthday,
          uid: "123wr234rsaf2",
        }
      }
    },
  }
})

export const {logOut, logIn} = login.actions;
export default login.reducer;