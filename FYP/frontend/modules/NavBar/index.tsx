'use client'
import Image from 'next/image'
import styles from './style.module.css'
import Logo from '../../static/tutormelogo.png'
import Cart from '../../static/market.png'
import { useAppSelector } from '@/redux/store'
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { logOut } from '@/redux/features/loginSlice'
import { useRouter } from "next/navigation"
import { clearUser } from '@/redux/features/userSlice'
import User from '../../static/user-interface.png'
import LoadingScreen from '../../components/LoadingScreen/page' // Adjust the import path as needed

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  
  const user = useAppSelector((state) => state.user)
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn)
  const [navOpen, setNavOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    setIsLoading(true)
    dispatch(clearUser())
    dispatch(logOut())
    setTimeout(() => {
      router.push('/Welcome')
      setIsLoading(false)
    }, 1000) // Simulate loading delay
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/Landing">
            <Image src={Logo} height={40} alt="Logo" />
          </Link>
        </div>

        <div className={styles.burger} onClick={() => setNavOpen(prev => !prev)}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={`${styles.navLinks} ${navOpen ? styles.open : ''}`}>
          <Link href="/Landing">Home</Link>
          {user.type === "student" && <Link href="/Store">Learn Now</Link>}
          <Link href="/AboutUs">About Us</Link>
          <Link href="/ContactUs">Contact Us</Link>
        </div>

        <div className={styles.login} ref={dropdownRef}>
          <div onClick={() => setDropdownOpen(prev => !prev)} style={{ cursor: 'pointer' }}>
            <Image
              src={ user.image ? user.image : User }
              alt={`avatar`}
              height={50}
              width={50}
            />
          </div>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <Link href="/Profile">Profile</Link>
              <Link href="/Calendar">Calendar</Link>
              {
                isLoggedIn ? 
                <Link href="/Welcome" onClick={handleLogout}>Logout</Link> :
                <Link href="/Welcome" onClick={handleLogout}>Login</Link>
              }
            </div>
          )}
        </div>
      </div>
    </>
  )
}
