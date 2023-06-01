import Photo from "../../../Photos/Photo";
import styles from "./resultItem.module.css";
import axios from "axios";
import {useEffect, useState} from "react";
const ResultFormItem = (url, caption) => {

    return (
        <div className={styles.form_item}>
            {/* <img src={url} alt="" /> */}
            <Photo url={url.url} caption = {caption}></Photo>
        </div>
    )
}

export default ResultFormItem;