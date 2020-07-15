import { Tag, Branch } from 'nef-common'

export interface RepositoryInfo {
    name: string
    description: string
    owner: string
    avatar: URL
    requirement: Tag | Branch
}
