import styles from "./page.module.css"
import Welcome from "./Welcome/page"

export default function Home() {
  return (
    <div className={styles.page}>
      <Welcome/>
    </div>
  )
}
  