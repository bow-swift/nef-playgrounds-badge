import { HTTPClient } from "./httpClient";
import { GitHubRepo } from "../models/repository";

export class GitHubAPI {
    httpClient = new HTTPClient("api.github.com")

    public async tags(owner: string, repo: string): Promise<Tag[]> {
        const values = await this.focusName(`/repos/${owner}/${repo}/tags`)
        const tags = values.map((tag: string): Tag => { return {_type: "tag", value: tag} })
        return tags
    }
    
    public async branches(owner: string, repo: string): Promise<Branch[]> {
        const values = await this.focusName(`/repos/${owner}/${repo}/branches`)
        const branches = values.map((branch: string): Branch => { return {_type: "branch", value: branch} })
        return branches
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
