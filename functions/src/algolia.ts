import { config } from 'firebase-functions'
import algoliasearch from 'algoliasearch'

const ALGOLIA_ID = "myfirebase-baa9e"
const ALGOLIA_ADMIN_KEY = "AIzaSyASvt2hmeOO7ZcLJ0WftyYjSH_N4lSZw34"
const tweetsIndexName = 'tweets'

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)

export const tweetsIndex = client.initIndex(tweetsIndexName)
