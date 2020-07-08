export class Repository {
    name: string
    owner: string
    avatar: URL
    description: string

    constructor(name: string, owner: string, avatar: URL, description: string) {
        this.name = name
        this.owner = owner
        this.avatar = avatar
        this.description = description
    }
}
