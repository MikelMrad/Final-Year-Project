import Image from "next/image";
import styles from "./style.module.css";
import Logo from "../../static/logo.png"
import User from "../../static/user-interface.png"
import Cart from "../../static/market.png"
import { useAppSelector } from "@/redux/store";

export default function Home() {

  const cartItems = useAppSelector((state) => state.cart.items);

  let cartCount = 0;
  cartItems.forEach(item => {
    cartCount += item.quantity;
  });

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
      <div className={styles.navLinks}>
        <a href='/'>Home</a>
        <a href='/Store'>Shop Now</a>
        <a href='/AboutUs'>About Us</a>
        <a href='/ContactUs'>Contact Us</a>
      </div>
      <div className={styles.login}>
        <div style={{ position: 'relative' }}>
          <a href="/Cart">
          <Image 
          src={Cart}
          height={50}
          width={50}
          alt='Logo' />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '0',
              right: '0',
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '50%',
              padding: '5px 10px',
              fontSize: '12px',
            }}>
          {cartCount}
            </span>
          )} 
          </a>
        </div>
        <a href="/Login">
        <Image 
        src={User}
        height={50}
        width={50}
        alt='Logo'>
        </Image>
        </a>
      </div>
    </div>
  );
}
