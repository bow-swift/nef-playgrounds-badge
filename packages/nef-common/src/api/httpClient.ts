import { request, RequestOptions, IncomingMessage } from 'http'
import { HTTPResponse } from './models/httpResponse'

export class HTTPClient {
    host: string

    constructor(host: string) {
        this.host = host
    }

    request<T>(options: RequestOptions): Promise<HTTPResponse<T>> {
        return new Promise<HTTPResponse<T>>((resolve, reject) => {
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
                        const result: HTTPResponse<T> = {
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
