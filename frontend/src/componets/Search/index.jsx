import search from "../../assets/search.svg";
import styles from "./search.module.css";

const Search = ({ text, callback }) => {
  return (
      <label className={styles.search}>
        <img src={search} alt={''} className={styles.search__icon}/>
        <input
            type="search"
            value={text}
            onChange={callback}
            className={styles.search__input}
            placeholder={'Введіть опис картинки'}
        />
      </label>
  )
}

export default Search