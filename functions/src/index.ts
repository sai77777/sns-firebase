import * as admin from 'firebase-admin'

admin.initializeApp()

export { createUser } from './triggers/user/create'
export { createUserCallable } from './handlers/user/create'

export { incrementFollowCount } from './triggers/user/incrementFollowCount'
export { decrementFollowCount } from './triggers/user/decrementFollowCount'
export { incrementFollowerCount } from './triggers/user/incrementFollowerCount'
export { decrementFollowerCount } from './triggers/user/decrementFollowerCount'

export { createFollowTweetByCreateTweet } from './triggers/followTweet/createByCreateTweet'
export { createFollowTweetByCreateFollowUser } from './triggers/followTweet/createByCreateFollowUser'
export { deleteFollowTweetByDeleteFollowUser } from './triggers/followTweet/deleteByDeleteFollowUser'

export { createTweetIndexByCreateTweet } from './triggers/tweetIndex/createByCreateTweet'
