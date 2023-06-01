import { Swiper, SwiperSlide } from "swiper/react"
import ResultForm from "./ResultForm";
import ResultFormItem from "./ResultFormItem";
import styles from "./switchingResult.module.css";
const SwitchingResult = ({photosArr}) => {

    
    if(photosArr !== null && photosArr !== undefined){
        return (
            <Swiper
                className={styles.result}
                spaceBetween={36}
                slidesPerView={'auto'}
            >
                {photosArr.map(photo=>(
                    <SwiperSlide className={styles.result__slide}>
                        <ResultForm photo={photo}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        )
    }

    return (
        <div>Результату немає</div>
    )
    
}

export default SwitchingResult;