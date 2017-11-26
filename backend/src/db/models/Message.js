// @flow

import mongoose from 'mongoose'
const autoIncrement = require('mongoose-sequence')(mongoose)

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
  _id: {
    type: Number,
  },
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
}, {_id: false})

MessageSchema.plugin(autoIncrement, {inc_field: '_id'})

export default mongoose.model('Message', MessageSchema)
