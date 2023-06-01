import styles from "./switchFaces.module.css"
import { useEffect, useState } from "react";
const SwitchFaces = ({onButtonClick}) => {

    const handleClick = () => {
        onButtonClick();
    };

    return (
        <div className={styles.btnContainer}>
            <button onClick={handleClick} className={styles.switchBtn}>Switch Faces</button>
        </div>
    )
}

export default SwitchFaces;