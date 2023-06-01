import styles from "./form_item.module.css";
import upload from "../../../../assets/upload.svg";
import deleteImg from "../../../../assets/deleteImg.svg";
import { useRef, useEffect } from "react";
import * as faceapi from 'face-api.js';
const FormItem = ({ url, name, callback, onFaceDetection }) => {

  const imageRef = useRef();

  
  useEffect(() => {
    if (imageRef.current) {
      onFaceDetection(imageRef);
    }
  }, [imageRef, url]);

  if (url === '') return (
      <label className={styles.form_item__upload}>
        <img
          src={upload}
          alt={'Upload'}
          className={styles.form_item__icon}
        />
        <span>Оберіть файл</span>
        <input
            name={name}
            type="file"
            onChange={callback}
            className={styles.form_item__input}
        />
      </label>
  )

  return (
      <div className={styles.form_item}>
        <img
          ref={imageRef}
          src={url} 
          alt="" />
      </div>
  )
}

export default FormItem