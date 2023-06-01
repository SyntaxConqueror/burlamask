import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { FileDto } from './dto/file.dto';
import axios from 'axios';
import * as sharp from 'sharp';
@Injectable()
export class FilesService {
    
    constructor(
      private readonly configService: ConfigService,
      @Inject("IMAGES_SERVICE") private readonly imagesService: ClientProxy
    ){}

    private publicFiles: FileDto[] = [];
    private resultImages = [];


  async saveResultImage(image: Buffer, name: string){
    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: image,
      Key: `${this.configService.get("AWS_FOLDER_NAME")}${uuid()}-${name}`
    }).promise();

    this.resultImages.push({
      url: uploadResult.Location,
      name: name
    });
  }

  async sendPhoto(file, caption, faceCords){
    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: file.buffer,
      Key: `${uuid()}-${file.originalname}`
    }).promise();


    const newFile = {
      key: uploadResult.Key,
      url: uploadResult.Location,
      originalname: file.originalname,
      caption: caption,
      faceCords: faceCords
    };
    await this.publicFiles.push(newFile);
    return uploadResult;
  }

  async deletePhoto(file){
    const photoIndex = this.publicFiles.findIndex(obj => obj.originalname == file.originalname);
    const photo = this.publicFiles.find(obj => obj.originalname == file.originalname);
    const s3 = new S3();
    await s3.deleteObject({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: photo.key,
    }).promise();

    this.publicFiles.splice(photoIndex, 1);
  }

  async cropImageFaceToBuffer(file: FileDto, bw, bh, wk, hk){
    const res = await new Promise<any>((resolve, reject) => {
      this.imagesService.send({cmd:"crop-face"}, {file, bw, bh, wk, hk}).subscribe(
        (result: any) => {
          resolve(result);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
    return Buffer.from(res);

  }

  async makeImageOval(image: Buffer, w, h) {
    const res = await new Promise<Buffer>((resolve, reject) => {
      this.imagesService.send({cmd:"make-oval"}, {image, w, h}).subscribe(
        (result: any) => {
          resolve(result as Buffer);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
    
    return Buffer.from(res);

  }


  async returnResBuffer(background: Buffer, ovalFace: Buffer, backgroundFace: FileDto){
    const res = await new Promise<any>((resolve, reject) => {
      this.imagesService.send({cmd: "result-buffer"}, {background, ovalFace, backgroundFace}).subscribe(
        (result: any) => {
          resolve(result);
        },
        (error: any) => {
          reject(error);
        }
      );
    });

    return Buffer.from(res);

  }

  async compose(){
    this.resultImages = [];
    
    for(let i = 0; i < this.publicFiles.length; i++){

      if(i+1 == this.publicFiles.length){
        // Getting image buffers
        const responseBack = await axios.get(this.publicFiles[0].url, { responseType: 'arraybuffer' });
        
        const responseFace = await axios.get(this.publicFiles[i].url, { responseType: 'arraybuffer' });

        const background = responseBack.data;
        const faceOrigBuffer = responseFace.data;

        // Getting width and height from buffers
        const backgroundWidth = (await sharp(background).metadata()).width;
        const backgroundHeight = (await sharp(background).metadata()).height;

        const faceWidth = (await sharp(faceOrigBuffer).metadata()).width;
        const faceHeight = (await sharp(faceOrigBuffer).metadata()).height;

        // Calculation width and height factor
        const width_k = backgroundWidth / faceWidth;
        const height_k = backgroundHeight / faceHeight;

        // Crop an oval from a face
        const face = await this.cropImageFaceToBuffer(this.publicFiles[i], backgroundWidth, backgroundHeight, width_k, height_k);
        
        const ovalFace = await this.makeImageOval(face, this.publicFiles[0].faceCords._width, this.publicFiles[0].faceCords._height);
        
        const resBuffer = await this.returnResBuffer(background, ovalFace, this.publicFiles[0]);
        await this.saveResultImage(resBuffer, `${this.publicFiles[0].caption} with ${this.publicFiles[i].caption} face.png`);
        break;
        
      }



      // Getting image buffers
      const responseBack = await axios.get(this.publicFiles[i+1].url, { responseType: 'arraybuffer' });
      
      const responseFace = await axios.get(this.publicFiles[i].url, { responseType: 'arraybuffer' });

      
      const background = responseBack.data;
      const faceOrigBuffer = responseFace.data;

      // Getting width and height from buffers
      const backgroundWidth = (await sharp(background).metadata()).width;
      const backgroundHeight = (await sharp(background).metadata()).height;

      const faceWidth = (await sharp(faceOrigBuffer).metadata()).width;
      const faceHeight = (await sharp(faceOrigBuffer).metadata()).height;

      // Calculation width and height factor
      const width_k = backgroundWidth / faceWidth;
      const height_k = backgroundHeight / faceHeight;

      // Crop an oval from a face
      const face = await this.cropImageFaceToBuffer(this.publicFiles[i], backgroundWidth, backgroundHeight, width_k, height_k);
      const ovalFace = await this.makeImageOval(face, this.publicFiles[i+1].faceCords._width, this.publicFiles[i+1].faceCords._height);


      const resBuffer = await this.returnResBuffer(background, ovalFace, this.publicFiles[i+1]);
      await this.saveResultImage(resBuffer, `${this.publicFiles[i+1].caption} with ${this.publicFiles[i].caption} face.png`);
    }
    this.publicFiles = [];
    return this.resultImages;
    
  }

    
}
