import * as functions from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { hasAlreadyTriggered } from '../../services/triggerEvent'
import { FieldValue } from '@google-cloud/firestore'

const followerUserPath = 'users/{uid}/followerUsers/{followerUID}'

export const decrementFollowerCount = functions.firestore
  .document(followerUserPath)
  .onDelete(async (snapshot, context) => {
    const eventID = context.eventId as string
    const uid = context.params.uid as string

    if (await hasAlreadyTriggered(eventID, 'decrementFollowerCount')) {
      return { message: 'follower count already decremented.' }
    }

    const db = firestore()
    const userRef = db.collection('users').doc(uid)
    await userRef.update({ followerCount: FieldValue.increment(-1) })

    return { message: 'follower count decremented successfully.' }
  })
