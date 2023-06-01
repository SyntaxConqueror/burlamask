import styles from "./photo.module.css";
import { useRef, useEffect } from "react";
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import download from "../../../assets/download.svg";
const Photo = ({ url, name }) => {
  
  return (
      <div className={styles.photo}>
        <img src={url} alt={name} className={styles.photo__img} />
        <div className={styles.span__cont}>
          <span 
            className={styles.photo__caption}>
              {name!==undefined ? name.slice(0, -4): name}
          </span>
          {name !== undefined 
          ? 
          <a style={{alignSelf:"center"}} href={url}>
            <img src={download} className={styles.download__image} alt="download"></img>
          </a> 
          : 
          <></>}
            
        </div>
        
      </div>
  )
}

export default Photo