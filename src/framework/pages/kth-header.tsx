// noinspection ES6UnusedImports
import { createElement } from 'inferno-create-element'

export function KthHeader ({ blocks }) {
  return (
    <div>
      <div id='header' class='header  hasPrimaryHeader  hasSecondaryHeader'>
        <div id='primaryHeader' class='primaryHeader'>
          <div id='imageLogoBlock' dangerouslySetInnerHTML={{ __html: blocks.image }}>
          </div>
          <div class='blockItemSeparator blockItemSeparatorIndex0'>
            <span class='blockItemSeparatorInner'/>
            <div id='searchBlock' dangerouslySetInnerHTML={{ __html: blocks.search }}/>
          </div>
        </div>
        <div id='secondaryHeader' class='secondaryHeader'>
          <span dangerouslySetInnerHTML={{ __html: blocks.title }}/>
          <div class='blockItemSeparator blockItemSeparatorIndex0'>
            <span class='blockItemSeparatorInner'/>
          </div>
          <span dangerouslySetInnerHTML={{ __html: blocks.language }}/>
        </div>
      </div>

      <hr id='headerHr'/>
    </div>
  )
}
