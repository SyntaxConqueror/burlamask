import Photo from "./Photo/index.jsx";
import styles from "./photos.module.css"

const Photos = ({ photos }) => {
  const items = photos.map(photo => <Photo {...photo} />)

  return (
      <main className={styles.photos}>
        {items.length > 0 ? <h1>Всі фото</h1> : <h1>Не знайдено</h1> }
        {items.length <= 3 
        ? <section className={styles.photos__wrapper}> { items } </section> 
        : <section className={styles.photos__wrapper_i4}> { items } </section> }
          
        
      </main>
  )
}

export default Photos