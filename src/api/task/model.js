import mongoose, { Schema } from 'mongoose';
import mongooseKeywords from 'mongoose-keywords';

const schema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
  description: {
    type: String,
  },
  startedAt: {
    type: Date,
  },
  finishedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['已发布', '已结束'],
  },
  rewards: {
    type: Number,
    default: 0,
  },
  maxJobs: {
    type: Number,
    min: 1,
    max: 100000,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id; },
  },
});

schema.methods = {
  view(full) {
    const view = {
      // simple view
      id: this.id,
      userId: this.userId,
      title: this.title,
      description: this.description,
      status: this.status,
      rewards: this.rewards,
      maxJobs: this.maxJobs,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    return full ? {
      ...view,
      // add properties for a full view
    } : view;
  },
};

schema.plugin(mongooseKeywords, { paths: ['title', 'description'] });

const model = mongoose.model('Task', schema);

export default model;
