import Upload from "./Upload/index.jsx";
import SwitchFaces from "../SwitchFaces/index.jsx";
import SwitchingResult from "./SwitchingResult/index.jsx";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
const Sliders = ({onTransferData}) => {

  const [clicked, setClicked] = useState(null);
  const [photosArr, setPhotosArr] = useState(null);
  const [arrNotNull, setArrNotNull] = useState(false);
  const onButtonClick = () => {
    setClicked(true);
  }

  const handleTransfer = (photos) => {
    onTransferData(photos);
  };

  const getReq = async () => {
    setClicked(false);
    return await axios.get("http://localhost:8000/api/v1/switchFaces").then(response => {
      setPhotosArr(response.data);
    });
    
  }

  useEffect(()=>{
    if(clicked){
      getReq();
    }
    
  }, [clicked]);

  useEffect(()=>{
    if(photosArr != null){
      setArrNotNull(true);
      handleTransfer(photosArr);
    }
  }, [photosArr])


  return (
      <>
        <Upload/>
        <SwitchFaces onButtonClick={onButtonClick}/>
        <SwitchingResult photosArr = {arrNotNull? photosArr: null}/>
      </>
  )
}

export default Sliders