import { HttpService } from '@nestjs/axios';
import { AxiosHeaderValue } from 'axios';
import { lastValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


export async function fetchData(
  httpService: HttpService,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,  // Datos opcionales para POST y PUT
  extraHeaders: Record<any, AxiosHeaderValue> = {}
): Promise<any> {

  try {
    const response = await lastValueFrom(
      httpService.request({
        method: method,
        url: url,
        data: data, // Incluir datos si hay
        headers: extraHeaders,
        responseType: 'json',
      }).pipe(
        map((response:any) => response?.data),
        catchError((error) => {
          throw new Error(`Error al procesar la respuesta: ${error.message}`);
        })
      )
    );
    return response;
  } catch (error) {
    return error.message;
  }
}
