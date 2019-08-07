// noinspection ES6UnusedImports
import { createElement } from 'inferno-create-element'
import { KthHeader } from './kth-header'

const errorStyle = `
#kth-pmenu #menu-bar-wrapper {
  z-index: 9999;
}

  body.error {
  background-color: #e3e5e3;
}

  body.error .content {
  box-shadow: 0 0 5px 5px #aeb4ae;
  background-color: #fff;
  transform: rotate(-5deg);
  -moz-transform: rotate(-5deg);
  -webkit-transform: rotate(-5deg);
  padding: 30px 40px 40px;
  max-width: 550px;
  margin: 30px auto;
}

  body.error .content h1 {
  font-size: 2.8rem;
  font-family: Georgia Regular,Georgia,garamond pro,garamond,times new roman,times,serif;
  font-weight: 400;
  border-bottom: none;
}

  body.error .content .kthLovesGeeks {
  color: #b9bbbd;
}
`

interface ResourceFileNames {
  vendorJs: string
}

interface ErrorPageProps {
  blocks: any
  supportReferenceId: string,
  supportMessage: string,
  proxyPrefixPathUri: string
  status: number
  friendly: string
  message: string,
  language: string,
  resourceFileNames: ResourceFileNames
}

export function ErrorPage ({ blocks, proxyPrefixPathUri, status, friendly, message, supportMessage, supportReferenceId, language, resourceFileNames }: ErrorPageProps) {
  return (
    <html lang={language}>
    <head>
      <title>{friendly}</title>
      <meta http-equiv='Content-Type' content='utf-8'/>
      <meta http-equiv='X-UA-Compatible' content='IE=edge'/>
      <meta name='viewport' content='width=device-width, initial-scale=1'/>
      <meta name='description' content='{{description}}'/>
      <link rel='shortcut icon' id='favicon' href='//www.kth.se/img/icon/favicon.ico'/>

      <link rel='stylesheet' href={proxyPrefixPathUri + '/static/kth-style/css/kth-bootstrap.min.css'}/>

      <style dangerouslySetInnerHTML={{ __html: errorStyle }}/>

      <script src={proxyPrefixPathUri + '/static/' + resourceFileNames.vendorJs}/>
      <script src='//www.kth.se/social/toolbar/widget.js'/>

    </head>
    <body class='error code{{status}} use-personal-menu'>
    <div class='content'>
      <KthHeader blocks={blocks} proxyPrefixPathUri={proxyPrefixPathUri} language={language}/>
      <h1>{status}</h1>
      <h3>{friendly}</h3>
      <p>{supportMessage}: <strong>{supportReferenceId}</strong></p>

      <div class='message'>
        <p class='kthLovesGeeks'>{ `HTTP ${status}: ${message}` }</p>
      </div>
    </div>
    </body>
    </html>
  )
}
