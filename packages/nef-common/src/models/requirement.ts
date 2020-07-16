export interface Tag {
    type: "tag"
    value: string
}

export interface Branch {
    type: "branch"
    value: string
}

export type Requirement = Tag | Branch
