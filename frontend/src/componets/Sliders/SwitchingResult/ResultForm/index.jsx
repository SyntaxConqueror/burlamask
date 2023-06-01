import ResultFormItem from "../ResultFormItem";
import styles from "./resultForm.module.css";
import download from '../../../../assets/download.svg'
const ResultForm = ({photo}) =>{
    
    return (
        <form className={styles.form}>
          <div className={styles.form__item}>          
            <ResultFormItem url={photo.url}/>
            <div className={styles.label__cont}>
              <label style={{textAlign: "center", alignSelf:"center"}}>{photo.name.slice(0, -4)}</label>
              <a href={photo.url}><img src={download} className={styles.download__img} alt="download"></img></a>
            </div>
            
          </div>
      </form>
    )
}

export default ResultForm;