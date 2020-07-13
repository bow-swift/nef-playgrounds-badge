import { HTTPClient } from "./httpClient";
import { GitHubRepository } from "../models/repository";

export class GitHubAPI {
    httpClient = new HTTPClient("api.github.com")

    public async tags(owner: string, repo: string): Promise<Tag[]> {
        const values: [string] = await this.focusName(`/repos/${owner}/${repo}/tags`)
        const tags = values.map((tag: string): Tag => { return {_type: "tag", value: tag} })
        return tags
    }
    
    public async branches(owner: string, repo: string): Promise<Branch[]> {
        const values: [string] = await this.focusName(`/repos/${owner}/${repo}/branches`)
        const branches = values.map((branch: string): Branch => { return {_type: "branch", value: branch} })
        return branches
    }

    public async repositoryInfo(owner: string, repo: string): Promise<GitHubRepository> {
        return this.httpClient.request({
            path: `/repos/${owner}/${repo}`,
            method: 'GET',
        }).then(response => {
            const ownerSection = response.data.get("owner")
            const name = response.data.get("name")
            const description = response.data.get("description").trim()
            const login = ownerSection.login
            const avatar = ownerSection.avatar_url
            if (ownerSection == undefined || name == undefined || description == undefined ||
                login == null || avatar == null) { throw new Error(`invalid repository response: ${response}`) }

            return new GitHubRepository(name, login, new URL(avatar), description)
        })
    }

    private async focusName(path: string): Promise<[string]> {
        return this.httpClient.request({
            path: path,
            method: 'GET',
        }).then(response => {
            const values = response.data.values()
            const res = Array.from(values).map(it => it.name)
            return res as [string]
        })
    }
}
