import admin from '#config/firebase'

export default class NotificationService {
  static async sendNewCustomerNotification(customerName: string) {
    const message = {
      notification: {
        title: 'New Customer Created',
        body: `Customer ${customerName} has been added`,
      },
      topic: 'customers',
    }

    await admin.messaging().send(message)
  }
}
