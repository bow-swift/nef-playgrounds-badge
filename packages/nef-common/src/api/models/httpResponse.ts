import { IncomingHttpHeaders } from 'http'

export interface HTTPResponse<T> {
    data: T,
    headers: IncomingHttpHeaders
}
