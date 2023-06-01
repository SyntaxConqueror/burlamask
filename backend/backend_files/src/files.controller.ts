import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { MessagePattern } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller("/api/v1")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/sendPhoto')
  @UseInterceptors(FileInterceptor('file'))
  async sendPhoto(@UploadedFile() file, @Body('data') data: string, @Body('faceCords') faceCords) {
    
    return this.filesService.sendPhoto(file, data, JSON.parse(faceCords));
  } 

  
  @Post('/deletePhoto')
  @UseInterceptors(FileInterceptor('file'))
  async deletePhoto(@UploadedFile() file){
    return this.filesService.deletePhoto(file);
  }

  @Get('/switchFaces')
  async compose(){
    return this.filesService.compose();
  }
  
}
