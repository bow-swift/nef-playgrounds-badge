export class NefDocument {
    document: Document

    constructor(document: Document) {
        this.document = document
    }

    repositoryField(): (HTMLInputElement | null) {
        return document.getElementById("repository") as HTMLInputElement
    }

    tagsSelector(): (HTMLOptionElement | null) {
        return document.getElementById("tags") as HTMLOptionElement
    }

    preview(): (HTMLDivElement | null) {
        return document.getElementById("repo-preview") as HTMLDivElement
    }

    setName(value: string) {
        (document.getElementById("name") as HTMLHeadingElement).textContent = value
    }

    setOwner(value: string) {
        (document.getElementById("owner") as HTMLHeadingElement).textContent = value
    }

    setAvatar(url: URL) {
        (document.getElementById("avatar") as HTMLImageElement).src = url.toString()
    }

    setDescription(value: string) {
        (document.getElementById("repo-description") as HTMLParagraphElement).textContent = value
    }

    setVersion(value: string) {
        (document.getElementById("selected-tag") as HTMLParagraphElement).textContent = value
    }

    setBadge(value: string) {
        (document.getElementById("badge-code") as HTMLTextAreaElement).textContent = value
    }
}
