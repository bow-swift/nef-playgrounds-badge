import { CTADocument } from "./utils/document"
import 'nef-common'

export class NefPlaygrounds {
    dom: CTADocument

    constructor(dom: CTADocument) {
        this.dom = dom
    }

    // handlers
    public onStart() {
        // this.resetOptions()
        // this.dom.optionSelector()?.disable()
        // this.dom.preview()?.display(false)
        // const input = this.inputInfo(element)
        // if (input == null) {
        //     this.hintRepository("Fill textfiled using format {owner}/{repo}")
        //     return;
        // }

        // Promise.all([
        //     this.client.tags(input.owner, input.repo),
        //     this.client.branches(input.owner, input.repo)
        // ])
        // .then(reqs => {
        //     const tags = reqs[0]
        //     const branches = reqs[1]
        //     this.updateOptions({tags: tags, branches: branches})
        //     this.resetHints()

        //     if (tags.length > 0 || branches.length > 0) {
        //         this.dom.optionSelector()?.enable()
        //     }
        // })
        // .catch(reason => {
        //     this.hintRepository(`Could not read repository 'https://github.com/${input.owner}/${input.repo}'`)
        // })
    }

}
