import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { MessagePattern } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from './dto/file.dto';

@Controller()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @MessagePattern({cmd: "crop-face"})
  async cropFace(data: {file: FileDto, bw, bh, wk, hk}){
    return await this.imagesService.cropImageFaceToBuffer(data.file, data.bw, data.bh, data.wk, data.hk);
  }

  @MessagePattern({cmd:"make-oval"})
  async makeOval(data: {image: Buffer, w, h}){
    return this.imagesService.makeImageOval(data.image, data.w, data.h);
  }

  @MessagePattern({cmd:"result-buffer"})
  async returnResBuffer(data: {background: Buffer, ovalFace: Buffer, backgroundFace: FileDto}){
    return this.imagesService.returnResBuffer(data.background, data.ovalFace, data.backgroundFace);
  }
}
