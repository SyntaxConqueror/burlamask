import styles from "./logo.module.css";
import logo from "../../assets/logo.svg";

const Logo = () => {
  return (
      <div className={styles.logo}>
        <img src={logo} alt={'logo'} className={styles.logo__image} />
        <span className={styles.logo__text}>BurlaMask</span>
      </div>
  )
}

export default Logo