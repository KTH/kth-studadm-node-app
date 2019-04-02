// noinspection ES6UnusedImports
import { createElement } from 'inferno-create-element'

export function KthFooter ({ blocks }) {
  return (
    <footer class='container' dangerouslySetInnerHTML={{ __html: blocks.footer }}></footer>
  )
}
