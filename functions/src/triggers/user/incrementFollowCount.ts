import * as functions from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { hasAlreadyTriggered } from '../../services/triggerEvent'
import { FieldValue } from '@google-cloud/firestore'

const followUserPath = 'users/{uid}/followUsers/{followUID}'

export const incrementFollowCount = functions.firestore.document(followUserPath).onCreate(async (change, context) => {
  const eventID = context.eventId as string
  const uid = context.params.uid as string

  if (await hasAlreadyTriggered(eventID, 'incrementFollowCount')) {
    return { message: 'follow count already incremented.' }
  }

  const db = firestore()
  const userRef = db.collection('users').doc(uid)
  await userRef.update({ followCount: FieldValue.increment(1) })

  return { message: 'follow count incremented successfully.' }
})
