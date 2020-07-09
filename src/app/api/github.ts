import { HTTPClient } from "./httpClient";
import { GitHubRepository } from "../models/repository";

export class GitHubAPI {
    httpClient = new HTTPClient("api.github.com")

    public tags(owner: string, repo: string): Promise<[string]> {
        return this.tagURL(owner, repo).then(url => {
            const items = url.split(this.httpClient.host)
            const repoPath = items[items.length-1]
            return this.repositorySourceInfo(repoPath)
        });
    }

    public branches(owner: string, repo: string): Promise<[string]> {
        return this.branchURL(owner, repo).then(url => {
            const items = url.split(this.httpClient.host)
            const repoPath = items[items.length-1]
            return this.repositorySourceInfo(repoPath)
        });
    }

    public repositoryInfo(owner: string, repo: string): Promise<GitHubRepository> {
        return this.httpClient.request({
            path: `/repos/${owner}/${repo}`,
            method: 'GET',
        }).then(response => {
            const ownerSection: any = response.data.get("owner") as Map<string, string>
            const login = ownerSection.login
            const avatar = ownerSection.avatar_url
            if (login == null || avatar == null) { throw new Error(`invalid repository response: ${response}`) }

            const name = response.data.get("name")
            const avatarURL = new URL(avatar)
            const description = response.data.get("description").trim()

            return new GitHubRepository(name, login, avatarURL, description)
        })
    }

    private repositorySourceInfo(repoPath: string): Promise<[string]> {
        return this.httpClient.request({
            path: repoPath,
            method: 'GET',
        }).then(response => {
            const values = response.data.values()
            const res = Array.from(values).map((it) => it.name)
            return res as [string]
        })
    }

    private tagURL(owner: string, repo: string): Promise<string> {
        return this.httpClient.request({
            path: `/repos/${owner}/${repo}`,
            method: 'GET',
        }).then(response => response.data.get("tags_url"))
    }

    private branchURL(owner: string, repo: string): Promise<string> {
        return this.httpClient.request({
            path: `/repos/${owner}/${repo}`,
            method: 'GET',
        }).then(response => response.data.get("branches_url").replace("{/branch}", ""))
    }
}
