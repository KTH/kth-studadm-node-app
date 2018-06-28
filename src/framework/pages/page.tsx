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
        <meta http-equiv='Content-Type' content='utf-8'/>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'/>
        <meta name='viewport' content='width=device-width, initial-scale=1'/>
        <meta name='description' content='{{description}}'/>
        <link rel='shortcut icon' id='favicon' href='//www.kth.se/img/icon/favicon.ico'/>
        <title>{title}</title>

        <link rel='stylesheet' href={proxyPrefixPathUri + '/static/kth-style/css/kth-bootstrap.min.css'}/>

        <script src={proxyPrefixPathUri + '/static/' + resourceFileNames.vendorJs}/>
        <script src='https://www.kth.se/social/toolbar/widget.js'/>
        {extraHeadContent}
      </head>
      <body>
      <div class='container'>
        <KthHeader blocks={blocks}/>
        <div id='app'>{children}</div>
        <KthFooter blocks={blocks}/>
        <script src={proxyPrefixPathUri + '/static/' + resourceFileNames.appJs}/>
      </div>
      </body>
      </html>
    )
  }
}
