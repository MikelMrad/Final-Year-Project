import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface InitialState {
  isLoggedIn: boolean
  token: string | null
  username: string
  email: string
}

const initialState: InitialState = {
  isLoggedIn: false,
  token: null,
  username: "",
  email: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<{ token: string; username: string; email: string }>) => {
      state.isLoggedIn = true
      state.token = action.payload.token
      state.username = action.payload.username
      state.email = action.payload.email
    },
    logOut: (state) => {
      state.isLoggedIn = false
      state.token = null
      state.username = ""
      state.email = ""
    },
  },
})

export const { logIn, logOut } = loginSlice.actions
export default loginSlice.reducer
