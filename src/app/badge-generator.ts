import { NefDocument } from "./utils/document"
import { GitHubAPI } from "./api/github"
import { GitHubInput } from "./models/githubInput"
import { GitHubRepository, GitHubRepositorySource } from "./models/repository"
import { removeNonASCII } from "./utils/string-format"
import "./utils/htmlElement"

export class NefPlaygrounds {
    dom: NefDocument
    client: GitHubAPI
    source: (GitHubRepositorySource | null)

    constructor(dom: NefDocument, client: GitHubAPI) {
        this.dom = dom
        this.client = client
        this.source = null
    }

    // handlers
    public onRepositoryChanged(element: HTMLInputElement, event: Event) {
        this.resetOptions()
        this.dom.sourceSelector()?.disable()
        this.dom.preview()?.hide()
        const input = this.inputInfo(element)
        if (input == null) { return; }

        Promise.all([
            this.client.tags(input.owner, input.repo),
            this.client.branches(input.owner, input.repo)
        ]).then((value: [[string], [string]]) => {
            const tags = value[0]
            const branches = value[1]
            this.updateOptions(new GitHubRepositorySource(tags, branches))
            if (tags.length > 0 || branches.length > 0) {
                this.dom.sourceSelector()?.enable()
            }
        })
    }

    public onSourceChanged(element: HTMLOptionElement, event: Event) {
        const repositoryField = this.dom.repositoryField()
        const option = element.value
        const info = (repositoryField == null) ? null : this.inputInfo(repositoryField)
        const source = this.source
        if (info == null || option == "" || source == null) {
            this.dom.preview()?.hide()
            return;
        }

        this.client.repositoryInfo(info.owner, info.repo).then(repository => {
            this.resetCopyButton()
            this.dom.preview()?.show()
            this.updatePreview(repository, option, info.owner, info.repo)
        }).catch(reason => {
            this.dom.preview()?.hide()
            console.log(reason)
        })
    }

    public onOptionClicked(element: HTMLElement, event: Event) {
        const source = this.source
        if (source == null) return;

        this.dom.preview()?.hide()
        this.resetOptions()
        this.updateOptions(source)
    }

    public onCopyClicked(element: HTMLButtonElement, event: Event) {
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

    private resetOptions() {
        this.source = null

        const selector = this.dom.sourceSelector()
        selector?.removeChildren()

        const option = document.createElement("option")
        option.value = ""
        option.innerText = "Choose..."
        selector?.append(option)
    }

    private updateOptions(source: GitHubRepositorySource) {
        this.source = source
        if (source.tags.length < 0 && source.branches.length < 0) return;

        const selector = this.dom.sourceSelector()
        const options = this.dom.isTagSelected() ? source.tags : source.branches

        options.forEach(option => {
            const element = document.createElement("option")
            element.value = option
            element.innerText = option
            selector?.append(element)
        })
    }

    private updatePreview(info: GitHubRepository, option: string, owner: string, repo: string) {
        const deeplink = this.deeplink(info, option, owner, repo)

        this.dom.setTagBranchName(option)
        this.dom.setName(info.name)
        this.dom.setAvatar(info.avatar)
        this.dom.setDescription(info.description)
        this.dom.setOwner(info.owner)
        this.dom.setTextArea(`<a href="${deeplink}">${this.badge(info.name)}</a>`)
    }

    private deeplink(info: GitHubRepository, option: string, owner: string, repo: string): string {
        const avatarURL = info.avatar.toString()
        const nameEscaped = escape(info.name)
        const ownerEscaped = escape(info.owner)
        const descriptionEscaped = escape(removeNonASCII(info.description))
        const source = this.dom.isTagSelected() ? "tag" : "branch"

        const deeplink = `https://nef.bow-swift.io/recipe?name=${nameEscaped}&description=${descriptionEscaped}&url=https://github.com/${owner}/${repo}&owner=${ownerEscaped}&avatar=${avatarURL}`
        return `${deeplink}&${source}=${option}`
    }

    private badge(title: string): string {
        return `<img src="https://raw.githubusercontent.com/bow-swift/bow-art/master/badges/nef-playgrounds-badge.svg" alt="${title} Playground" style="height:20px">`
    }
}
