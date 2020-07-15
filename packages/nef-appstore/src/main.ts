import { CTADocument } from "./app/utils/document"
import { NefCTA } from "./app/cta"
import 'nef-common'

function initPage() {
  const dom = new CTADocument(document)
  const component = new NefCTA(dom)
  component.onStart()
}

initPage()
