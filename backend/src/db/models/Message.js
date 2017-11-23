// @flow

import mongoose from 'mongoose'

type BaseMessage = {
  sender: string,
  body: string,
  group: string,
  sentAt: Date,
}

export type UpsertPost = BaseMessage & {
  _id?: string,
}

const MessageSchema = mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    ref: 'Group',
  },
  sentAt: {
      type: String,
  },
})

export default mongoose.model('Message', MessageSchema)
