import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { type Response } from 'express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Post('convert')
  @UseInterceptors(FileInterceptor('file')) // 'file' es el nombre del campo que enviaremos desde el front
  async convertFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      return res.status(400).send('No se ha subido ningún archivo.');
    }

    // Convertimos el buffer del archivo a string (HTML)
    const htmlContent = file.buffer.toString('utf-8');

    // Llamamos a nuestro motor de conversión
    const excelBuffer =
      await this.appService.convertDefontanaToExcel(htmlContent);

    // Configuramos las cabeceras para que el navegador entienda que es una descarga
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Reporte_Uniforme_Defontana.xlsx',
    );

    // Enviamos el archivo
    return res.send(excelBuffer);
  }
}
