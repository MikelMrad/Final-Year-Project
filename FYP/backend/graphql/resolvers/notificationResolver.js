const Notification = require("../../models/Notification")
const NotificationType = require("../types/NotificationType")
const { GraphQLList, GraphQLID, GraphQLString, GraphQLBoolean } = require("graphql")

const NotificationQueries = {
  notifications: {
    type: new GraphQLList(NotificationType),
    resolve() {
      return Notification.find().populate("recipient")
    }
  },
  notification: {
    type: NotificationType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Notification.findById(args.id).populate("recipient")
    }
  }
}

const NotificationMutations = {
  addNotification: {
    type: NotificationType,
    args: {
      recipient: { type: GraphQLID },
      message: { type: GraphQLString }
    },
    resolve(_, args) {
      const notification = new Notification({
        recipient: args.recipient,
        message: args.message
      })
      return notification.save()
    }
  },
  markNotificationAsRead: {
    type: NotificationType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return Notification.findByIdAndUpdate(args.id, { read: true }, { new: true })
    }
  }
}

module.exports = { NotificationQueries, NotificationMutations }
