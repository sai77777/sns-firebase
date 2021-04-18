import { config } from 'firebase-functions'
import algoliasearch from 'algoliasearch'

const ALGOLIA_ID = config().algolia.application_id
const ALGOLIA_ADMIN_KEY = config().algolia.api_key
const tweetsIndexName = 'tweets'

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)

export const tweetsIndex = client.initIndex(tweetsIndexName)
