import * as functions from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { chunk } from 'lodash'
import { buildTweet } from '../../entities/tweet'
import { buildCloneUser } from '../../entities/cloneUser'
import { hasAlreadyTriggered } from '../../services/triggerEvent'

const tweetPath = 'users/{uid}/followUsers/{followUID}'

const count = 50

export const createFollowTweetByCreateFollowUser = functions.firestore
  .document(tweetPath)
  .onCreate(async (snapshot, context) => {
    const eventID = context.eventId as string
    const uid = context.params.uid as string

    if (await hasAlreadyTriggered(eventID, 'createFollowTweetByCreateFollowUser')) {
      return { message: 'follow tweets already created.' }
    }

    const db = firestore()

    const followUser = buildCloneUser(snapshot.id, snapshot.data())

    const tweetsRef = followUser.ref.collection('tweets')
    const tweetsSnapshot = await tweetsRef.limit(count).get()
    const tweets = tweetsSnapshot.docs.map((doc) => buildTweet(doc.id, doc.data()))
    
    const followTweetsRef = db.collection('users').doc(uid).collection('followTweets')

    const tweetChunk = chunk(tweets, 400)

    for (const tweets of tweetChunk) {
      const batch = db.batch()
      tweets.forEach((tweet) => {
        const tweetRef = tweetsRef.doc(tweet.id)
        batch.create(followTweetsRef.doc(tweet.id), {
          ref: tweetRef,
          writer: tweet.writer,
          //origin: tweet.origin,
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
        })
      })
      await batch.commit()
    }

    return { message: 'follow tweets is created successfully.' }
  })
