// noinspection ES6UnusedImports
import { createElement } from 'inferno-create-element'

export function KthHeader ({ blocks }) {
  return (
    <header>
      <div class='container-fluid'>
        <div class='container'>
          <div class='header-container__top'>
            <figure class='block figure defaultTheme mainLogo' data-cid='1.77257' lang='sv-SE'>
              <a href='/studentlistor/kurstillfallen'><img class='figure-img img-fluid' src='https://www.kth.se/polopoly_fs/1.77257.1529058455!/KTH_Logotyp_RGB_2013-2.svg' alt='KTH:s logotyp' height='70' width='70' /></a>
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
          <nav id='breadcrumbs' class='col-12 col-md-9'>
            <ol aria-label='Brödsmulor - navigation uppåt i innehållsstrukturen' class='breadcrumb'>
            </ol>
          </nav>
          <div class='translations col-12 col-md-3' dangerouslySetInnerHTML={{ __html: blocks.language }}>
          </div>
        </div>
      </div>
    </header>
  )
}
