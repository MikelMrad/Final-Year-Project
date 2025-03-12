import styles from "./page.module.css";
import Landing from "./Landing/page";
import Checkout from "./Checkout/page";
import Category from "./Category/page";

export default function Home() {
  return (
    <div className={styles.page}>
      <Landing/>
    </div>
  );
}
  