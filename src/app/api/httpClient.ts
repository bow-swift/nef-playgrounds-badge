import { request, RequestOptions, IncomingMessage, IncomingHttpHeaders } from 'http';
import { stringify } from 'querystring';
import { Console } from 'console';

export interface Response<T> {
    data: T,
    headers: IncomingHttpHeaders
}

export class HTTPClient {
    host: string

    constructor(host: string) {
        this.host = host
    }

    request<T>(options: RequestOptions): Promise<Response<T>> {
        return new Promise<Response<T>>((resolve, reject) => {
            options.host = this.host
            request(
                options,
                (response: IncomingMessage) => {
                    const { statusCode, headers } = response
                    const chunks: any[] = []
                    if (statusCode == null || statusCode >= 300) {
                        reject(new Error(response.statusMessage))
                    }

                    response.on('data', (chunk: any) => {
                        chunks.push(chunk);
                    })

                    response.on('end', () => {
                        const data: string = Buffer.concat(chunks).toString()
                        const result: Response<T> = {
                            data: JSON.parse(data),
                            headers: headers,
                        }
                        resolve(result)
                    })
                }
            ).end()
        })
    }
}
