export class GitHubRepository {
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

export class GitHubRepositorySource {
    tags: [string]
    branches: [string]

    constructor(tags: [string], branches: [string]) {
        this.tags = tags
        this.branches = branches
    }
}
