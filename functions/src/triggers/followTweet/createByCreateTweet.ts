import * as functions from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { chunk } from 'lodash'
import { buildTweet } from '../../entities/tweet'
import { buildCloneUser } from '../../entities/cloneUser'
import { hasAlreadyTriggered } from '../../services/triggerEvent'

const tweetPath = 'users/{uid}/tweets/{tweetID}'

export const createFollowTweetByCreateTweet = functions.firestore
  .document(tweetPath)
  .onCreate(async (snapshot, context) => {
    const eventID = context.eventId as string
    const uid = context.params.uid as string

    if (await hasAlreadyTriggered(eventID, 'createFollowTweetByCreateTweet')) {
      return { message: 'follow tweets already created.' }
    }

    const tweet = buildTweet(snapshot.id, snapshot.data())

    const db = firestore()

    const followerUsersRef = db.collection('users').doc(uid).collection('followerUsers')
    const followerUsersSnapshot = await followerUsersRef.get()
    const followerUsers = followerUsersSnapshot.docs.map((doc) => buildCloneUser(doc.id, doc.data()))

    const followerUserChunk = chunk(followerUsers, 500)

    for (const followerUsers of followerUserChunk) {
      const batch = db.batch()
      followerUsers.forEach((followerUser) => {
        const followTweetsRef = followerUser.ref.collection('followTweets')
        batch.create(followTweetsRef.doc(tweet.id), {
          ref: snapshot.ref,
          writer: tweet.writer,
          origin: tweet.origin,
          createdAt: tweet.createdAt,
          updateAt: tweet.updatedAt,
        })
      })
      await batch.commit()
    }

    return { message: 'follow tweets is created successfully.' }
  })
