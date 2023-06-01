import styles from "./header.module.css"
import Logo from "../Logo/index.jsx";
import Search from "../Search/index.jsx";

const Header = ({ text, callback }) => {
  return (
      <header className={styles.header}>
        <Logo />
        <Search text={text} callback={callback} />
      </header>
  )
}

export default Header