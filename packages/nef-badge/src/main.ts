import { GitHubAPI } from "./app/api/github"
import { NefDocument } from "./app/utils/document"
import { NefPlaygrounds } from "./app/badge-generator"
import 'nef-common'

function initPage() {
  const githubClient = new GitHubAPI()
  const dom = new NefDocument(document)
  const component = new NefPlaygrounds(dom, githubClient)

  addEventListeners(component, dom)
}

initPage()

// initialize
function addEventListeners(component: NefPlaygrounds, dom: NefDocument) {
  const field = dom.repositoryField()
  const selector = dom.optionSelector()
  const tagOption = dom.tagOption()
  const branchOption = dom.branchOption()
  const copyButton = dom.copyButton()

  field?.addEnterKeyListener((_, event) => component.onRepositoryChanged(field, event))
  field?.addEventListener("change", (event: Event) => component.onRepositoryChanged(field, event))
  selector?.addEventListener("change", (event: Event) => component.onOptionSelected(selector, event))
  tagOption?.addEventListener("click", (event: Event) => component.onSourceChanged(tagOption, event))
  branchOption?.addEventListener("click", (event: Event) => component.onSourceChanged(branchOption, event))
  copyButton?.addEventListener("click", (event: Event) => component.onCopyClicked(copyButton, event))
}
