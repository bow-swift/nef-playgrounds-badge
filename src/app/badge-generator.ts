import { NefDocument } from "./utils/document"
import { GitHubAPI } from "./api/github"
import { GitHubInput } from "./models/githubInput"
import { GitHubRepo } from "./models/repository"
import { removeNonASCII } from "./utils/string-format"
import "./utils/htmlElement"

export class NefPlaygrounds {
    dom: NefDocument
    client: GitHubAPI
    source: (Source | null)

    constructor(dom: NefDocument, client: GitHubAPI) {
        this.dom = dom
        this.client = client
        this.source = null
    }

    // handlers
    public onRepositoryChanged(element: HTMLInputElement, event: Event) {
        this.resetOptions()
        this.dom.optionSelector()?.disable()
        this.dom.preview()?.hide()
        const input = this.inputInfo(element)
        if (input == null) { return; }

        Promise.all([
            this.client.tags(input.owner, input.repo),
            this.client.branches(input.owner, input.repo)
        ])
        .then(reqs => {
            const tags = reqs[0]
            const branches = reqs[1]
            this.updateOptions({tags: tags, branches: branches})

            if (tags.length > 0 || branches.length > 0) {
                this.dom.optionSelector()?.enable()
            }
        })
    }

    public onSourceChanged(element: HTMLElement, event: Event) {
        const source = this.source
        if (source == null) return;

        this.dom.preview()?.hide()
        this.resetOptions()
        this.updateOptions(source)
    }

    public onOptionSelected(element: HTMLOptionElement, event: Event) {
        const source = this.source
        const repositoryField = this.dom.repositoryField()
        const info = (repositoryField == null) ? null : this.inputInfo(repositoryField)
        const selectedTag = source?.tags.filter(it => it.value == element.value)[0]
        const selectedBranch = source?.branches.filter(it => it.value == element.value)[0]
        const option = selectedTag ? selectedTag : selectedBranch
        
        if (source == null || info == null || option == undefined) {
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

        const selector = this.dom.optionSelector()
        selector?.removeChildren()

        const option = document.createElement("option")
        option.value = ""
        option.innerText = "Choose..."
        selector?.append(option)
    }

    private updateOptions(source: Source) {
        this.source = source
        if (source.tags.length < 0 && source.branches.length < 0) return;

        const selector = this.dom.optionSelector()
        const options = this.dom.isTagSelected() ? source.tags.map(it => it.value) : source.branches.map(it => it.value)

        options.forEach((option: string) => {
            const element = document.createElement("option")
            element.value = option
            element.innerText = option
            selector?.append(element)
        })
    }

    private updatePreview(info: GitHubRepo, option: Tag | Branch, owner: string, repo: string) {
        const deeplink = this.deeplink(info, option, owner, repo)

        this.dom.setTagBranchName(option.value)
        this.dom.setName(info.name)
        this.dom.setAvatar(new URL(info.owner.avatar_url))
        this.dom.setDescription(info.description)
        this.dom.setOwner(info.owner.login)
        this.dom.setTextArea(`<a href="${deeplink}">${this.badge(info.name)}</a>`)
    }

    private deeplink(info: GitHubRepo, option: Tag | Branch, owner: string, repo: string): string {
        const avatarURL = info.owner.avatar_url
        const nameEscaped = escape(info.name)
        const ownerEscaped = escape(info.owner.login)
        const descriptionEscaped = escape(removeNonASCII(info.description).trim())
        const source = option._type == 'tag' ? "tag" : "branch"

        const deeplink = `https://nef.bow-swift.io/recipe?name=${nameEscaped}&description=${descriptionEscaped}&url=https://github.com/${owner}/${repo}&owner=${ownerEscaped}&avatar=${avatarURL}`
        return `${deeplink}&${source}=${option.value}`
    }

    private badge(title: string): string {
        return `<img src="https://raw.githubusercontent.com/bow-swift/bow-art/master/badges/nef-playgrounds-badge.svg" alt="${title} Playground" style="height:20px">`
    }
}
