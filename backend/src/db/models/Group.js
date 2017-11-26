// @flow

import mongoose from 'mongoose'

type BaseGroup = {
  name: string,
  description: string,
  members: Array<string>,
}

export type UpsertGroup = BaseGroup & {
  _id?: string,
}

const GroupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    max: 30,
    min: 4,
  },
  description: {
    type: String,
  },
  private: {
    type: Boolean,
    default: false,
  },
  messages: {
    type: [{type: Number, ref: 'Message'}],
  },
  members: {
      type: Array,
      default: [],
  },
})

export default mongoose.model('Group', GroupSchema)
