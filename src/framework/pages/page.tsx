// noinspection ES6UnusedImports
import { createElement } from 'inferno-create-element'
import { KthHeader } from './kth-header'
import { KthFooter } from './kth-footer'
import { Component } from 'inferno'

interface ResourceFileNames {
  vendorJs: string,
  appJs: string
}

interface PageProps {
  blocks: any
  title: string
  proxyPrefixPathUri: string
  extraHeadContent?: any
  children: any,
  language: string
  resourceFileNames: ResourceFileNames
}

export class Page extends Component<PageProps, {}> {
  render ({ blocks, proxyPrefixPathUri, extraHeadContent, title, children, language, resourceFileNames }: PageProps) {
    return (
      <html lang={language}>
        <head>
          <meta http-equiv='Content-Type' content='utf-8' />
          <meta http-equiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='description' content='{{description}}' />
          <link rel='shortcut icon' id='favicon' href='//www.kth.se/img/icon/favicon.ico' />
          <title>{title}</title>

          {/* <link rel='stylesheet' href={'https://www.kth.se/css/kth-eaf75b4dcc731582488f6534515477db.css'} /> */}
          <link rel='stylesheet' href={proxyPrefixPathUri + '/static/kth-style/css/kth-bootstrap.css'}/>

          <script src={proxyPrefixPathUri + '/static/kth-style/js/jquery-3.3.1.min.js'} />
          <script src={proxyPrefixPathUri + '/static/kth-style/js/popper.min.js'} />

          <script src={proxyPrefixPathUri + '/static/' + resourceFileNames.vendorJs} />
          <script src={proxyPrefixPathUri + '/static/kth-style/js/bootstrap.min.js'} />
          <script src={proxyPrefixPathUri + '/static/kth-style/js/backtotop.min.js'} />
          <script src={proxyPrefixPathUri + '/static/kth-style/js/menus.min.js'} />
          <script src='https://www.kth.se/social/toolbar/widget.js' />
          {extraHeadContent}
        </head>
        <body class='defaultTheme use-personal-menu'>
          <KthHeader blocks={blocks} />
          <div class='container start noMainMenu'>
            <div id='app' class='row'>
                {children}
            </div>
          </div>
          <KthFooter blocks={blocks} />
          <div id='back-to-top' role='link' class='' aria-hidden='true'>Till sidans topp</div>
          <script src={proxyPrefixPathUri + '/static/' + resourceFileNames.appJs} />
        </body>
      </html>
    )
  }
}
