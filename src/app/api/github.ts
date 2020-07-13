import { HTTPClient } from "./httpClient";
import { GitHubRepository } from "../models/repository";

export class GitHubAPI {
    httpClient = new HTTPClient("api.github.com")

    public tags(owner: string, repo: string): Promise<[string]> {
        return this.focusName(`/repos/${owner}/${repo}/tags`)
    }

    public branches(owner: string, repo: string): Promise<[string]> {
        return this.focusName(`/repos/${owner}/${repo}/branches`)
    }

    public repositoryInfo(owner: string, repo: string): Promise<GitHubRepository> {
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

    private focusName(repoPath: string): Promise<[string]> {
        return this.httpClient.request({
            path: repoPath,
            method: 'GET',
        }).then(response => {
            const values = response.data.values()
            const res = Array.from(values).map((it) => it.name)
            return res as [string]
        })
    }
}
