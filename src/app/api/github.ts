import { HTTPClient } from "./httpClient";
import { GitHubRepository } from "../models/githubInfo";

export class GitHubAPI {
    httpClient = new HTTPClient("api.github.com")

    public tags(owner: string, repo: string): Promise<[string]> {
        return this.tagURL(owner, repo).then(url => {
            const items = url.split(this.httpClient.host)
            const repoPath = items[items.length-1]
            return this.repositoryTags(repoPath)
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

            return new GitHubRepository(
                response.data.get("name"), 
                login, 
                new URL(avatar), 
                response.data.get("description") 
            )
        })
    }

    private repositoryTags(repoPath: string): Promise<[string]> {
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
}
