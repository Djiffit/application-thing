// @flow

import mongoose from 'mongoose'

import type {DbModel, Id} from '$app/types'
import type {UpsertGroup} from '$db/models/Group'

type BaseUser = {
  name: string,
  password: string,
  groups: Array<UpsertGroup>,
  friends: Array<UpsertUser>,
  image: string,
}

export type DbUser = DbModel & BaseUser

export type UpsertUser = BaseUser & {
  _id?: Id,
}

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    min: 4,
    max: 32,
  },
  friends: {
    type: Array,
    ref: 'User',
  },
  groups: {
    type: Array,
    ref: 'Group',
  },
  image: {
    type: String,
  },
})

export default mongoose.model('User', UserSchema)
