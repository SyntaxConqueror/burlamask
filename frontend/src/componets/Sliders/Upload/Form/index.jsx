import {useState, useRef, useEffect} from "react";
import FormItem from "../FormItem/index.jsx";
import styles from "./form.module.css"
import deleteImg from "../../../../assets/deleteImg.svg"
import axios from "axios";
import * as faceapi from 'face-api.js';


const Form = ({ id, onSubmit, onPostPhotos }) => {
  const [posted, setPosted] = useState(Boolean);
  const [deleteState, setDelete] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [postResp, setPostResp] = useState(null);
  const [caption, setCaption] = useState(String);
  const [faceCords, setFaceCords] = useState(null);

  const labelRef = useRef(null);

  // HANDLE CHANGING OF CAPTION LABEL
  const handleLabelChange = () => {
    const labelText = labelRef.current.innerText;
    setCaption(labelText);
    console.log(labelText);
  };

  // FUNCTION FOR POST REQUEST
  const postReq = (file, caption, faceCords) => {
    const formData = new FormData();
    
    formData.append('data', caption);
    formData.append('file', file);
    formData.append('faceCords', JSON.stringify(faceCords));
    
    return axios
      .post('http://localhost:8000/api/v1/sendPhoto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log(response.data);
        setPostResp(response.data);
      });
  };

  // FUNCTION FOR DELETE FILE
  const deleteReq = (file) => {
    const formData = new FormData();
    console.log(file);
    formData.append("file", file);
    return axios.post('http://localhost:8000/api/v1/deletePhoto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log(response.data);
    });
  };

  // FACE CORDS DETECTION FUNCTION
  const handleImageDetections = async (imageRef) => {
    await faceapi.nets.ssdMobilenetv1.load('/models');
    await faceapi.nets.faceLandmark68Net.load('/models');
    await faceapi.nets.faceExpressionNet.load('/models');

    const detections = await faceapi.detectAllFaces(imageRef.current).withFaceLandmarks();
    setFaceCords(detections[0].detection.box);
  };

  // DETECT WHICH COMPONENT IS SELECTED
  const onSelect = async ({ target }) => {
    const [file] = target.files;
    const instance = { file, url: URL.createObjectURL(file), key: null, caption: null };

    if (target.name === 'photo') {
      setPhoto(instance);
    }
    setDelete(false);
  };

  useEffect(() => {
    if (photo) {
      const formData = {
        photo,
        id
      };
      onSubmit(formData);
    }
  }, [photo]);


  useEffect(() => {
    if (caption){
      if(photo == null) {
        return;
      }
      postReq(photo.file, caption, faceCords);
    }
  }, [caption, faceCords]);

  useEffect(()=>{
    if(postResp){
      const updatedInstance = { ...photo, url: postResp.Location, key: postResp.key, caption: caption };
      setPhoto(updatedInstance);
    }
  }, [postResp]);
  
  // FUNCTION FOR DELETING FROM INPUT AN IMAGE
  const handleDelete = (name) => {
    if (name === 'photo') {
      if(photo == null){
        console.log("File is null");
        return "File is null";
      }
      deleteReq(photo.file);
      setPhoto(null);
    } 
    
  };

  return (
      <form className={styles.form}>
        <div className={styles.form__item}>
          <div className={styles.form_item__title}>
            <h3>Оберіть портрет</h3>
            <img 
              src={deleteImg}
              style={{
                width: "30px",
                aspectRatio: "1",
                cursor: "pointer"
              }}
              onClick={()=>handleDelete('photo')}
              alt={'Delete'} 
              className={styles.form_item__icon}
            />
          </div>
          <FormItem name={'photo'} url={photo?.url || ''} callback={onSelect} onFaceDetection={handleImageDetections}/>
          <label 
            contenteditable="true" 
            style={{textAlign: "center"}}
            ref={labelRef}
            onBlur={handleLabelChange}
            >Змініть текст</label>
        </div>
        
      </form>
  )
}

export default Form