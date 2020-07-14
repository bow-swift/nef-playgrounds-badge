export class Tag {
    type: string
    value: string

    constructor(value: string) {
        this.type = "tag"
        this.value = value
    }
}

export class Branch {
    type: string
    value: string

    constructor(value: string) {
        this.type = "branch"
        this.value = value
    }
}

export class Source {
    tags: Tag[]
    branches: Branch[]

    constructor(tags: Tag[], branches: Branch[]) {
        this.tags = tags
        this.branches = branches
    }
}
