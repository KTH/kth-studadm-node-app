// noinspection ES6UnusedImports
import { createElement } from 'inferno-create-element'

export function retrieveDataFromEnvelope (id) {
  if (!document || !document.getElementById) {
    throw new Error('retrieveDataFromEnvelope must be run in a browser')
  }
  const dataElement = document.getElementById(id)
  if (!dataElement) {
    throw new Error('Expected to find an element with id "' + id + '"')
  }
  return JSON.parse(dataElement.innerHTML)
}

export function DataEnvelope ({ data, id }: { data: any, id: string }) {
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data)
  return (
    <script type='application/json' id={id}
            dangerouslySetInnerHTML={{ __html: jsonString }}/>
  )
}