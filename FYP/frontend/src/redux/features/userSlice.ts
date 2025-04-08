import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  id: string
  name: string
  email: string
  type: "tutor" | "student" | ""
  token: string
  image: string
}

const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  type: "",
  token: "",
  image: "",
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.email = action.payload.email
      state.type = action.payload.type
      state.token = action.payload.token
      state.image = action.payload.image
    },
    clearUser: (state) => {
      state.id = ""
      state.name = ""
      state.email = ""
      state.type = ""
      state.token = ""
      state.image = ""
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
