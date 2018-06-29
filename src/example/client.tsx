import { retrieveDataFromEnvelope } from '../framework/components/data-envelope'
import { clientConfigEnvelopeId } from './client-config'

const config = retrieveDataFromEnvelope(clientConfigEnvelopeId)
console.log('client!', config)

