import * as functions from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { FieldValue } from '@google-cloud/firestore'

export const createUserCallable = functions.https.onCall(async (data) => {
  const uid = data.uid

  const db = firestore()

  const userRef = db.collection('users').doc(uid)
  const userSnapshot = await userRef.get()
  // if (userSnapshot.exists) {
  //   return { message: `already create ${uid} user` }
  // }

  const user = {
    name: data.displayName ?? '未設定',
    profile: '',
    thubmnailURL: null,
    followCount: 0,
    followerCount: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }

  if (userSnapshot.exists) {
    await userRef.set({
      profile: 'profile',
      thubmnailURL: 'https://www.yahoo.co.jp/'
    }, {merge: true})
    return { message: 'User is updated successfully.' + uid }
  }
  else{
    await userRef.set(user)
    return { message: 'New User is created successfully.' + uid }
  }
})
