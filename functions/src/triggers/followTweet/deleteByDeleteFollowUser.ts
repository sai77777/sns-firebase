import * as functions from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { chunk } from 'lodash'
import { buildTweet } from '../../entities/tweet'
import { buildCloneUser } from '../../entities/cloneUser'
import { hasAlreadyTriggered } from '../../services/triggerEvent'

const tweetPath = 'users/{uid}/followUsers/{followUID}'

export const deleteFollowTweetByDeleteFollowUser = functions.firestore
  .document(tweetPath)
  .onDelete(async (snapshot, context) => {
    const eventID = context.eventId as string
    const uid = context.params.uid as string

    if (await hasAlreadyTriggered(eventID, 'deleteFollowTweetByDeleteFollowUser')) {
      return { message: 'follow tweets already deleted.' }
    }

    const db = firestore()

    const followUser = buildCloneUser(snapshot.id, snapshot.data())

    const tweetsRef = followUser.ref.collection('tweets')
    const tweetsSnapshot = await tweetsRef.where('writer', '==', { ref: followUser.ref }).get()
    const tweets = tweetsSnapshot.docs.map((doc) => buildTweet(doc.id, doc.data()))

    const followTweetsRef = db.collection('users').doc(uid).collection('followTweets')

    const tweetChunk = chunk(tweets, 500)

    for (const tweets of tweetChunk) {
      const batch = db.batch()
      tweets.forEach((tweet) => {
        const followTweetRef = followTweetsRef.doc(tweet.id)
        batch.delete(followTweetRef)
      })
      await batch.commit()
    }

    return { message: 'follow tweets is deleted successfully.' }
  })
