const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
  login: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  acceptTerms: Boolean,
  verificationToken: String,
  verified: Date,
  resetToken: { token: String, expires: Date },
  passwordReset: Date,
  created: { type: Date, default: Date.now },
  updated: Date,
  avatar: { type: String, required: false },
  chatBan : { type: Boolean, default: false },
  inChat : { type: Boolean, default: false },
  blogBan : { type: Boolean, default: false },
  // If users aren't exist in a document sets the 'isAdmin' to true
  isAdmin : { type: Boolean, default: false },
  // role - 'admin' | 'moderator' | 'guest'
  role: { type: String, required: true },
  // Relationship with 'posts' - one-to-many
  posts: [ { type: Schema.Types.ObjectId, ref: 'Post' } ],
  // Relationship with 'chat-rooms' - one-to-many
  //rooms: [ { type: Schema.Types.ObjectId, ref: 'Chat-room' } ],
  registeredByAdmin: { type: Boolean, default: false }
});

// A _virtual_ is a schema property that is **not** stored in MongoDB.
// It is instead calculated from other properties in the document.
UserSchema.virtual('isVerified').get(function () {
    // In the getter function, `this` is the document. Don't use arrow
    // functions for virtual getters!
    return !!(this.verified || this.passwordReset);// !!'' - false, !!'t' - true
});

UserSchema.set('toJSON', {
    // Make Mongoose attach virtuals whenever calling `JSON.stringify()`,
    // including using `res.json()` when {virtuals: true}
    virtuals: true,
    // По умолчанию при сохранении данных Mongoose добавляет специальное поле __v,
    // которое указывает на версию документа. его можно отключить,
    // добавив в схему объект { versionKey: false }
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
    }
});

//In DB it will be 'users'
module.exports = model('User', UserSchema);
