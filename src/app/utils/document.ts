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

    textArea(): (HTMLTextAreaElement | null) {
        return document.getElementById("badge-code") as HTMLTextAreaElement
    }

    copyButton(): (HTMLButtonElement | null) {
        return document.getElementById("copy") as HTMLButtonElement
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

    setTextArea(value: string) {
        (document.getElementById("badge-code") as HTMLTextAreaElement).textContent = value
    }

    setCopyValue(value: string) {
        (document.getElementById("copy-value") as HTMLSpanElement).textContent = value
    }

    copySelection() {
        document.execCommand('copy')
    }
}
