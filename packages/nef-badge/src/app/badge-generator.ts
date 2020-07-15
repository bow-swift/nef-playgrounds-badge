import { NefDocument } from "./utils/document"
import { GitHubAPI } from "./api/github"
import { GitHubInput } from "./models/githubInput"
import { GitHubRepo } from "./models/repository"
import { Requirement } from 'nef-common'
import { removeNonASCII } from 'nef-common'
import 'nef-common'

export class NefPlaygrounds {
    dom: NefDocument
    client: GitHubAPI
    requirements: Requirement[]

    constructor(dom: NefDocument, client: GitHubAPI) {
        this.dom = dom
        this.client = client
        this.requirements = []
    }

    // handlers
    public onRepositoryChanged(element: HTMLInputElement, event: Event) {
        this.resetOptions()
        this.dom.optionSelector()?.disable()
        this.dom.preview()?.display(false)
        const input = this.inputInfo(element)
        if (input == null) {
            this.hintRepository("Fill textfiled using format {owner}/{repo}")
            return;
        }

        this.client.requirements(input.owner, input.repo).then(reqs => {
            this.updateOptions(reqs)
            this.resetHints()

            if (reqs.length > 0) {
                this.dom.optionSelector()?.enable()
            }
        })
        .catch(_ => {
            this.hintRepository(`Could not read repository 'https://github.com/${input.owner}/${input.repo}'`)
        })
    }

    public onSourceChanged(element: HTMLElement, event: Event) {
        const requirements = this.requirements
        if (requirements == null) return;

        this.dom.preview()?.display(false)
        this.resetOptions()
        this.updateOptions(requirements)
    }

    public onOptionSelected(element: HTMLOptionElement, event: Event) {
        const requirements = this.requirements
        const repositoryField = this.dom.repositoryField()
        const info = (repositoryField == null) ? null : this.inputInfo(repositoryField)
        const option = requirements.filter(it => it.value == element.value)[0]
        
        if (info == null || option == undefined) {
            this.dom.preview()?.display(false)
            this.hintOptions("Must select an option")
            return;
        }

        this.client.repositoryInfo(info.owner, info.repo).then(repository => {
            this.resetCopyButton()
            this.resetHints()
            this.dom.preview()?.display(true)
            this.updatePreview(repository, option, info.owner, info.repo)
        }).catch(reason => {
            this.dom.preview()?.display(false)
            this.internalError(`Could not read repository 'https://github.com/${info.owner}/${info.repo}'`)
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
        this.requirements = []

        const selector = this.dom.optionSelector()
        selector?.removeChildren()

        const option = document.createElement("option")
        option.value = ""
        option.innerText = "Choose..."
        selector?.append(option)
    }

    private updateOptions(requirements: Requirement[]) {
        this.requirements = requirements
        if (requirements.length < 0) return;

        const selector = this.dom.optionSelector()
        const options = this.dom.isTagSelected() ? requirements.filter(it => it.type == "tag") : requirements.filter(it => it.type == "branch")

        options.forEach((option: Requirement) => {
            const element = document.createElement("option")
            element.value = option.value
            element.innerText = option.value
            selector?.append(element)
        })
    }

    private updatePreview(info: GitHubRepo, option: Requirement, owner: string, repo: string) {
        const deeplink = this.deeplink(info, option, owner, repo)

        this.dom.setTagBranchName(option.value)
        this.dom.setName(info.name)
        this.dom.setAvatar(new URL(info.owner.avatar_url))
        this.dom.setDescription(info.description)
        this.dom.setOwner(info.owner.login)
        this.dom.setTextArea(`<a href="${deeplink}">${this.badge(info.name)}</a>`)
    }

    private deeplink(info: GitHubRepo, option: Requirement, owner: string, repo: string): string {
        const avatarURL = info.owner.avatar_url
        const nameEscaped = escape(info.name)
        const ownerEscaped = escape(info.owner.login)
        const descriptionEscaped = escape(removeNonASCII(info.description).trim())
        const source = option.type == "tag" ? "tag" : "branch"

        const deeplink = `https://nef.bow-swift.io/recipe?name=${nameEscaped}&description=${descriptionEscaped}&url=https://github.com/${owner}/${repo}&owner=${ownerEscaped}&avatar=${avatarURL}`
        return `${deeplink}&${source}=${option.value}`
    }

    private badge(title: string): string {
        return `<img src="https://raw.githubusercontent.com/bow-swift/bow-art/master/badges/nef-playgrounds-badge.svg" alt="${title} Playground" style="height:20px">`
    }

    // errors
    private internalError(info: string) {
        console.error(info)
    }

    private resetHints() {
        this.dom.repositoryFeedback()?.hide()
        this.dom.optionFeedback()?.hide()
    }

    private hintRepository(warning: string) {
        console.warn(warning)
        this.dom.setRepositoryFeedback(warning)
        console.log(this.dom.repositoryFeedback())
        this.dom.repositoryFeedback()?.show()
    }

    private hintOptions(warning: string) {
        console.warn(warning)
        this.dom.setOptionFeedback(warning)
        this.dom.optionFeedback()?.show()
    }
}
