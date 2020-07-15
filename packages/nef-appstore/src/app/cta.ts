import { CTADocument } from "./utils/document"
import { RepositoryInfo } from "./models/repositoryInfo"
import { Tag, Branch } from 'nef-common'
import 'nef-common'

export class NefCTA {
    dom: CTADocument

    constructor(dom: CTADocument) {
        this.dom = dom
    }

    // handlers
    public onStart(urlParams: URLSearchParams) {
        const repositoryInfo = this.repositoryInfo(urlParams)

        if (repositoryInfo != null) {
            this.loadRepoPreview(repositoryInfo)
        } else {
            this.loadBasicPreview()
        }
    }

    // private methods
    private loadRepoPreview(info: RepositoryInfo) {

    }

    private loadBasicPreview() {

    }

    // mapper
    private repositoryInfo(urlParams: URLSearchParams): RepositoryInfo | null {
        const name = urlParams.get('name')
        const description = urlParams.get('description')
        const owner = urlParams.get('owner')
        const avatar = urlParams.get('avatar')
        const tagParam = urlParams.get('tag')
        const branchParam = urlParams.get('branch')
        const tag: Tag | null = tagParam == null ? null : ({ value: tagParam })
        const branch: Branch | null = branchParam == null ? null : ({ value: branchParam })
        const requirement = tag == null ? branch : tag
      
        if (name == null || description == null || owner == null || avatar == null || requirement== null) {
          return null;
        }
      
        const avatarURL = new URL(avatar)
        if (avatarURL == null) { return null; }
      
        return ({
          name: name,
          description: description,
          owner: owner,
          avatar: avatarURL,
          requirement: requirement,
        })
      }
}
