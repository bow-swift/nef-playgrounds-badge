import { Tag, Branch } from 'nef-common'

export class CTADocument {
    document: Document

    constructor(document: Document) {
        this.document = document
    }

    recipePreview(): (HTMLCollection | null) {
        return document.getElementsByClassName("recipe-preview")
    }

    notRecipePreview(): (HTMLCollection | null) {
        return document.getElementsByClassName("recipe-preview-only")
    }

    setLibLogo(url: URL) {
        (document.getElementById("lib-logo") as HTMLImageElement).src = url.toString()
    }

    setLibTitle(value: string) {
        (document.getElementById("lib-title") as HTMLElement).textContent = value
    }

    setLibDescription(value: string) {
        (document.getElementById("lib-description") as HTMLElement).textContent = value
    }

    setLibOwner(value: string) {
        (document.getElementById("lib-owner") as HTMLElement).textContent = value
    }

    setRequirement(requirement: Tag | Branch) {
        const tag = (requirement.type == "tag") ? "Tag" : "Branch";
        (document.getElementById("lib-branch-tag") as HTMLElement).textContent = tag;
        (document.getElementById("lib-branch-tag-value") as HTMLElement).textContent = requirement.value;
    }
}
