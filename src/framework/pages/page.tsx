
// noinspection ES6UnusedImports
import { createElement } from 'inferno-create-element'
import { KthHeader } from './kth-header'
import { KthFooter } from './kth-footer'
import { Component } from 'inferno'
import { messages } from '../i18n'

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
  language: string,
  resourceFileNames: ResourceFileNames
}

export class Page extends Component<PageProps, any> {
  render ({ blocks, proxyPrefixPathUri, extraHeadContent, title, children, language, resourceFileNames }: PageProps) {
    return (
      <html lang={language}>
        <head>
          <meta http-equiv='Content-Type' content='utf-8' />
          <meta http-equiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='description' content='{{description}}' />
          <title>{title}</title>

          <link rel='stylesheet' href={proxyPrefixPathUri + '/static/kth-style/css/kth-bootstrap.css'}/>

          <script src={proxyPrefixPathUri + '/static/' + resourceFileNames.vendorJs} />
          <script src={proxyPrefixPathUri + '/static/kth-style/js/bootstrap.min.js'} />
          <script src='https://www.kth.se/social/toolbar/widget.js' />
          {extraHeadContent}

          <style dangerouslySetInnerHTML={{ __html: '#app { padding-bottom: 20px; }' }}></style>
        </head>
        <body class='defaultTheme use-personal-menu'>
          <KthHeader blocks={blocks} proxyPrefixPathUri={proxyPrefixPathUri} language={language} />
          <div class='container main'>
            <div id='app' class='row'>
                {children}
            </div>
          </div>
          <KthFooter blocks={blocks} />
          <script src={proxyPrefixPathUri + '/static/' + resourceFileNames.appJs} />
        </body>
      </html>
    )
  }
}
