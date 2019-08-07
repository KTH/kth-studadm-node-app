// noinspection ES6UnusedImports
import { createElement } from 'inferno-create-element'
import { messages } from '../i18n'

export function KthHeader ({ blocks, proxyPrefixPathUri, language }) {
  return (
    <header role='banner'>
      <div class='container-fluid'>
        <div class='container'>
          <div class='header-container__top'>
            <figure class='block figure defaultTheme mainLogo' data-cid='1.77257' dangerouslySetInnerHTML={{ __html: blocks.language }}>
              <a href={proxyPrefixPathUri}><img class='figure-img img-fluid' src={proxyPrefixPathUri + '/static/kth-style/img/kth-style/KTH_Logotyp_RGB_2013-2.svg'} alt='KTH:s logotyp' height='70' width='70' /></a>
            </figure>
            <div dangerouslySetInnerHTML={{ __html: blocks.title }}></div>
          </div>
          <div class='header-container__bottom'>
          </div>
        </div>
      </div>
      <div id='gradientBorder'></div>
      <div class='container articleNavigation'>
        <div class='row justify-content-between'>
          <nav id='breadcrumbs' class='col-12 col-md-9' dangerouslySetInnerHTML={{ __html: blocks.navigation }}>
            <ol aria-label={messages.breadcrumb[language]} class='breadcrumb'>
            </ol>
          </nav>
          <div class='translations col-12 col-md-3' dangerouslySetInnerHTML={{ __html: blocks.language }}>
          </div>
        </div>
      </div>
    </header>
  )
}
