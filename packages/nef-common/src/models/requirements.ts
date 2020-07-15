export interface Tag {
    type: "tag"
    value: string
}

export interface Branch {
    type: "branch"
    value: string
}

export interface Source {
    tags: Tag[]
    branches: Branch[]
}
