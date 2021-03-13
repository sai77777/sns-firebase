import { firestore } from 'firebase-admin'

export type CloneUser = {
  id: string
  ref: firestore.DocumentReference
  createdAt: Date
  updatedAt: Date
}

export const buildCloneUser = (id: string, data: firestore.DocumentData) => {
  const newCloneUser: CloneUser = {
    id,
    ref: data.ref,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  }

  return newCloneUser
}
