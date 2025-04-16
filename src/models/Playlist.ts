import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPlaylist extends Document {
  title: string;
  url: string;
  platform: 'spotify' | 'youtube';
  owner: Types.ObjectId;
  sharedWith: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    platform: { type: String, enum: ['spotify', 'youtube'], required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
