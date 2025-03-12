'use client'
import React from 'react';
import styles from "./style.module.css";
import Image from "next/image";
import Logo from "../../../static/logo.png"
import { useState } from 'react';
import { logIn , logOut } from "@/redux/features/loginSlice"
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/redux/store';
import Footer from '../../../modules/Footer';


export default function page (){

  const dispatch = useDispatch<AppDispatch>();

  const username = useAppSelector((state) => state.login.value.username);

  const [userFname , setUserFname] = useState("");
  const [userLname , setUserLname] = useState("");
  const [email , setEmail] = useState("");
  const [birthday , setBirthday] = useState("");

  const onclickLogIn = () => {
    const actionPayload = {
      username: userFname + " " + userLname,
      email: email,
      birthday: birthday,
    }
    dispatch(logIn(actionPayload));
  }
  const onclickLogOut = () => {
    dispatch(logOut());
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <a href="/">
        <Image 
        src={Logo}
        height={100}
        alt='Logo'>
        </Image>
        </a>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.form}>
        <label>First name:   </label>
        <input type="text" onChange={(e)=>setUserFname(e.target.value)}/> <br/><br/>
        <label>Last name:   </label>
        <input type="text" onChange={(e)=>setUserLname(e.target.value)}/> <br/><br/>
        <label>Email:   </label>
        <input type="text" onChange={(e)=>setEmail(e.target.value)}/> <br/><br/>
        <label>Birthday:   </label>
        <input type="date" onChange={(e)=>setBirthday(e.target.value)}/> <br/><br/>
        <a onClick={onclickLogIn}>Login</a>
        <a onClick={onclickLogOut}>Log out</a>
        </div>
        <p>{username}</p>
      </div>  
      <Footer/>
    </div>
  )
}
