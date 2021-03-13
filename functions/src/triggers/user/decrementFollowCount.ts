import * as functions from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { hasAlreadyTriggered } from '../../services/triggerEvent'
import { FieldValue } from '@google-cloud/firestore'

const followUserPath = 'users/{uid}/followUsers/{followUID}'

export const decrementFollowCount = functions.firestore.document(followUserPath).onDelete(async (snapshot, context) => {
  const eventID = context.eventId as string
  const uid = context.params.uid as string

  if (await hasAlreadyTriggered(eventID, 'decrementFollowCount')) {
    return { message: 'follow count already decremented.' }
  }

  const db = firestore()
  const userRef = db.collection('users').doc(uid)
  await userRef.update({ followCount: FieldValue.increment(-1) })

  return { message: 'follow count decremented successfully.' }
})
