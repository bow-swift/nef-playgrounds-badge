import { GitHubAPI } from "./app/api/github"
import { NefDocument } from "./app/utils/document"
import "./app/utils/htmlElement"
import { NefPlaygrounds } from "./app/nef-playgrounds"

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
  const tags = dom.tagsSelector()

  field?.addEventListener("change", (event: Event) => component.onChangeRepository(field, event))
  tags?.addEventListener("change", (event: Event) => component.onChangeTags(tags, event))
}
