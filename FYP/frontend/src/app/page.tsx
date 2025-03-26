import styles from "./page.module.css"
import Landing from "./Landing/page"

export default function Home() {
  return (
    <div className={styles.page}>
      <Landing/>
    </div>
  )
}
  