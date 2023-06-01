import { Inject, Injectable } from '@nestjs/common';
import { FileDto } from './dto/file.dto';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import * as sharp from 'sharp';

@Injectable()
export class ImagesService {
  
  async cropImageFaceToBuffer(file: FileDto, bw, bh, wk, hk){
    const response = await axios.get(file.url, { responseType: 'arraybuffer' });
    const imageData = response.data;
    let result = null;
    try {
     
      result = await sharp(imageData)
      .resize(bw, bh)
        .extract({ 
          width: Math.floor(file.faceCords._width*wk), 
          height: Math.floor(file.faceCords._height*hk), 
          left: Math.floor(file.faceCords._x*wk), 
          top: Math.floor(file.faceCords._y*hk)
        })
        .toBuffer();
    } catch (error) {
      console.log("cropFace");
    }
    
    return result;
  }

  async makeImageOval(image: Buffer, w, h) {
    const imageBuf = Buffer.from(image);
    
    const sharpImg = await sharp(imageBuf);
    
    const width = Math.floor(w) || 0;
    const height = Math.floor(h) || 0;
    const ovalBuffer = Buffer.from(
      `<svg><ellipse cx="${width/2}" cy="${height/2}" rx="${width/2}" ry="${height/2}" /></svg>`
    );
    try{
      const res = await sharpImg
      .resize({ width, height })
      .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .composite(
        [
          { 
            input: ovalBuffer,
            blend: 'dest-in'
          }
        ]
      )
      .png()
      .toBuffer();
      
      return res;
    } catch (error){
      console.log("makeOval");
    }
    
  }

  async returnResBuffer(background: Buffer, ovalFace: Buffer, backgroundFace: FileDto){
    background = Buffer.from(background);
    ovalFace = Buffer.from(ovalFace);
    try {
      const res = await sharp(background)
      .composite([
        {
          input: ovalFace,
          top: Math.floor(backgroundFace.faceCords._y),
          left: Math.floor(backgroundFace.faceCords._x),
        },
      ])
      .toBuffer();
      return res;

    } catch (error) {
      console.log("returnResBuffer");
    }
  }

  
}
