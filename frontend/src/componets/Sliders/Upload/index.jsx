import { Swiper, SwiperSlide } from "swiper/react";
import Form from "./Form/index.jsx";
import styles from "./upload.module.css"
import {useEffect, useState, useRef} from "react";
import 'swiper/css';
import { useSwiper } from 'swiper/react';

const Upload = ({onPostPhotos}) => {
  const [slides, setSlides] = useState([{ id: 1 }]);

  const handleFormSubmit = (formData) => {
    const isFormValid = formData && formData.photo;
    const lastSlideIndex = slides.length;

    if (isFormValid && formData.id === lastSlideIndex) {
      const newSlideId = lastSlideIndex + 1;
      const newSlide = { id: newSlideId };
      setSlides((prevSlides) => [...prevSlides, newSlide]);
    }
  };


  return (
      <Swiper
        className={styles.upload}
        spaceBetween={36}
        slidesPerView={'auto'}
      >
        {slides.map(slide => (
        <SwiperSlide key={slide.id} className={styles.upload__slide}>
          <Form id={slide.id} onSubmit={handleFormSubmit}/>
        </SwiperSlide>
      ))}
      </Swiper>
  )
}

export default Upload