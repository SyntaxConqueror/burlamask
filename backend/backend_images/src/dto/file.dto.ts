import { FaceCords } from "./face.dto";

export interface FileDto {
    originalname: string;
    key: string;
    url: string;
    caption: string;
    faceCords: FaceCords;
}