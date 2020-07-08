import { request, RequestOptions, IncomingMessage, IncomingHttpHeaders } from 'http';

export interface Response {
    data: Map<string, any>,
    headers: IncomingHttpHeaders
}

export class HTTPClient {
    host: string

    constructor(host: string) {
        this.host = host
    }

    request(options: RequestOptions): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            options.host = this.host
            request(
                options,
                function (response: IncomingMessage) {
                    const { statusCode, headers } = response;
                    const chunks: any[] = [];

                    if (statusCode == null || statusCode >= 300) {
                        reject(new Error(response.statusMessage))
                    }

                    response.on('data', (chunk: any) => {
                        chunks.push(chunk);
                    });
                    response.on('end', () => {
                        const data: string = Buffer.concat(chunks).toString();
                        const result: Response = {
                            data: objectToMap(JSON.parse(data)),
                            headers: headers,
                        };
                        resolve(result);
                    });
                }
            ).end();
        })
    }
}


// MARK: Utils

function objectToMap(obj: any): Map<string, any> {
    let map = new Map<string, any>();
    for (let key in obj) {
        let val = obj[key];
        map.set(key, val);
    }

    return map
}
