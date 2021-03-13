import { firestore } from 'firebase-admin'
import { EventContext } from 'firebase-functions'

export const hasAlreadyTriggered = (eventID: string, suffix: string): Promise<boolean> => {
  const triggerEventID = `${eventID}-${suffix}`
  const db = firestore()
  return db.runTransaction(async (trx) => {
    const ref = db.collection('triggerEvents').doc(triggerEventID)
    const snapshot = await trx.get(ref)

    if (snapshot.exists) {
      return true
    } else {
      trx.set(ref, {})
      return false
    }
  })
}
