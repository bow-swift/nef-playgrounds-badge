export interface GitHubRepo {
    name: string
    description: string
    languaje: string
    stargazers_count: number
    forks: number
    owner: GithubRepoOwner
}

export interface GithubRepoOwner {
    login: string
    avatar_url: string
    type: string
}