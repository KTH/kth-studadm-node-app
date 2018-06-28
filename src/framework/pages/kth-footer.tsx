// noinspection ES6UnusedImports
import { createElement } from 'inferno-create-element'

export function KthFooter ({ blocks }) {
  return (
    <div>
      <a id='backToTop' href='#top' />
      <div id='footer' class='expandToContainerWidth' dangerouslySetInnerHTML={{ __html: blocks.footer }} />
    </div>
  )
}
