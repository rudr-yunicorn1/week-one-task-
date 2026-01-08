import admin from 'firebase-admin'
import Env from '#start/env'

const serviceAccount = JSON.parse(Env.get('FIREBASE_SERVICE_ACCOUNT'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin
