import * as functions from 'firebase-functions'
import { buildTweet } from '../../entities/tweet'
import { hasAlreadyTriggered } from '../../services/triggerEvent'
import { tweetsIndex } from '../../algolia'

const tweetPath = 'users/{uid}/tweets/{tweetID}'

export const createTweetIndexByCreateTweet = functions.firestore
  .document(tweetPath)
  .onCreate(async (snapshot, context) => {
    const eventID = context.eventId as string

    if (await hasAlreadyTriggered(eventID, 'createTweetIndexByCreateTweet')) {
      return { message: 'tweet index already created.' }
    }

    const tweet = buildTweet(snapshot.id, snapshot.data())

    // MEMO: ソートに使用するので、number型に変換している
    const createdAtTimestamp = tweet.createdAt.getTime()
    const updatedAtTimestamp = tweet.updatedAt.getTime()

    const record = {
      objectID: tweet.id,
      id: tweet.id,
      text: tweet.text,
      writer: {
        id: tweet.writer.ref.id,
      },
      updatedAtTimestamp,
      createdAtTimestamp,
    }

    await tweetsIndex.saveObject(record)

    return { message: 'tweet index is created successfully.' }
  })
