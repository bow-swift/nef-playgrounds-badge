import { NefDocument } from "./utils/document"
import { GitHubAPI } from "./api/github"
import { GitHubInput } from "./models/githubInput"
import { GitHubRepository } from "./models/githubInfo"
import "./utils/htmlElement"

export class NefPlaygrounds {
    dom: NefDocument
    client: GitHubAPI

    constructor(dom: NefDocument, client: GitHubAPI) {
        this.dom = dom
        this.client = client
    }

    // handlers
    public onChangeRepository(element: HTMLInputElement, event: Event) {
        this.resetTags()
        this.dom.tagsSelector()?.disable()
        this.dom.preview()?.hide()
        const input = this.inputInfo(element)
        if (input == null) { return; }

        this.client.tags(input.owner, input.repo).then(tags => {
            this.updateTags(tags)
            if (tags.length > 0) { 
                this.dom.tagsSelector()?.enable() 
            }
        })
    }

    public onChangeTags(element: HTMLOptionElement, event: Event) {
        const repositoryField = this.dom.repositoryField()
        const tag = element.value
        const info = (repositoryField == null) ? null : this.inputInfo(repositoryField)
        if (info == null || tag == "") {
            this.dom.preview()?.hide()
            return;
        }

        this.client.repositoryInfo(info.owner, info.repo).then(repository => {
            this.resetCopyButton()
            this.dom.preview()?.show()
            this.updatePreview(repository, tag, info.owner, info.repo)
        }).catch(reason => {
            this.dom.preview()?.hide()
            console.log(reason)
        })
    }

    public onClickCopy(element: HTMLButtonElement, event: Event) {
        this.dom.textArea()?.select()
        this.dom.copySelection()
        this.dom.textArea()?.setSelectionRange(0, 0)
        this.setCopiedButton()
    }

    // helpers
    private inputInfo(element: HTMLInputElement): (GitHubInput | null) {
        const elements = element.value.replace(".git", "").split("/")
        if (elements.length != 2) { return null; }
        return new GitHubInput(elements[0], elements[1])
    }

    private resetCopyButton() {
        this.dom.setCopyValue("Copy")
    }

    private setCopiedButton() {
        this.dom.setCopyValue("Copied!")
    }

    private resetTags() {
        const selector = this.dom.tagsSelector()
        selector?.removeChildren()

        const option = document.createElement("option")
        option.value = ""
        option.innerText = "Choose..."
        selector?.append(option)
    }

    private updateTags(tags: [string]) {
        if (tags.length < 0) return;
        const selector = this.dom.tagsSelector()

        tags.forEach(tag => {
            const option = document.createElement("option")
            option.value = tag
            option.innerText = tag
            selector?.append(option)
        })
    }

    private updatePreview(info: GitHubRepository, tag: string, owner: string, repo: string) {
        const deeplink = this.deeplinkTag(info, tag, owner, repo)
        this.dom.setName(info.name)
        this.dom.setAvatar(info.avatar)
        this.dom.setDescription(info.description)
        this.dom.setVersion(tag)
        this.dom.setOwner(info.owner)
        this.dom.setTextArea(`<a href="${deeplink}">${this.badge(info.name)}</a>`)
    }

    private badge(title: string): string {
        return `<img src="https://raw.githubusercontent.com/bow-swift/bow-art/master/badges/nef-playgrounds-badge.svg" alt="${title} Playground" style="height:20px">`
    }

    private deeplinkTag(info: GitHubRepository, tag: string, owner: string, repo: string): string {
        return `https://nef.bow-swift.io/recipe?name=${escape(info.name)}&description=${escape(info.description)}&url=https://github.com/${owner}/${repo}&owner=${escape(info.owner)}&avatar=${info.avatar.toString()}&tag=${tag}`
    }

    private deeplinkBranch(info: GitHubRepository, branch: string, owner: string, repo: string): string {
        return `https://nef.bow-swift.io/recipe?name=${escape(info.name)}&description=${escape(info.description)}&url=https://github.com/${owner}/${repo}&owner=${escape(info.owner)}&avatar=${info.avatar.toString()}&branch=${branch}`
    }
}
