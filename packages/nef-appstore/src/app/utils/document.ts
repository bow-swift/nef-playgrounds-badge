import { Tag, Branch } from 'nef-common'

export class CTADocument {
    document: Document

    constructor(document: Document) {
        this.document = document
    }

    recipePreview(): HTMLElement[] {
        const previews = document.getElementsByClassName("recipe-preview")

        if (previews != null) {
            return [].slice.call(previews)
        } else {
            return []
        }
    }

    notRecipePreview(): HTMLElement[] {
        const previews = document.getElementsByClassName("basic-preview")

        if (previews != null) {
            return [].slice.call(previews)
        } else {
            return []
        }
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
        (document.getElementById("lib-branch-tag") as HTMLElement).textContent = requirement.type == "tag" ? "Tag" : "Branch";
        (document.getElementById("lib-branch-tag-value") as HTMLElement).textContent = requirement.value;
    }
}
