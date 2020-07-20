import { HTTPClient } from "./httpClient"
import { GitHubRepo } from "../models/repository"
import { Requirement } from "./models/Requirement"

export class GitHubAPI {
    httpClient = new HTTPClient("api.github.com")

    public async requirements(owner: string, repo: string): Promise<Requirement[]> {
        const tags = await this.tags(owner, repo)
        const branches = await this.branches(owner, repo)
        return tags.concat(branches)
    }

    public async tags(owner: string, repo: string): Promise<Requirement[]> {
        const values = await this.focusName(`/repos/${owner}/${repo}/tags`)
        return values.map(it => ({ type: "tag", value: it }))
    }
    
    public async branches(owner: string, repo: string): Promise<Requirement[]> {
        const values = await this.focusName(`/repos/${owner}/${repo}/branches`)
        return values.map(it => ({ type: "branch", value: it }))
    }

    public async repositoryInfo(owner: string, repo: string): Promise<GitHubRepo> {
        return this.httpClient.request<GitHubRepo>({
            path: `/repos/${owner}/${repo}`,
            method: 'GET',
        }).then(response => response.data)
    }

    private async focusName(path: string): Promise<string[]> {
        return this.httpClient.request<[PropertyName]>({
            path: path,
            method: 'GET',
        }).then(response => response.data.map(it => it.name))
    }
}

interface PropertyName {
    name: string
}
