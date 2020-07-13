type Tag = {
    _type: "tag"
    value: string
}

type Branch = {
    _type: "branch"
    value: string
}

type Source = {
    tags: Tag[]
    branches: Branch[]
}
