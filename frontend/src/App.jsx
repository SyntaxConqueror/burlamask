import Header from "./componets/Header";
import {useEffect, useState} from "react";
import Photos from "./componets/Photos/index.jsx";
import styles from "./App.module.css"
import axios from "axios";
import Sliders from "./componets/Sliders/index.jsx";

const App = () => {
  const [search, setSearch] = useState("");
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState(null);
 

  const handleTransferData = (data) => {
    setPhotos(data);
  };


  const handleInput = ({ target }) => {
    setSearch(target.value);
    setFilteredPhotos(target.value !== ""
        ? photos.filter(({ name }) => name.toLowerCase().includes(target.value.toLowerCase()))
        : photos
    )
  };


  return (
    <div className={styles.wrapper}>
      <Header text={search} callback={handleInput} />
      {search !== "" ? <Photos photos={filteredPhotos} /> : <Sliders onTransferData={handleTransferData}/>}
    </div>
  )
}

export default App
