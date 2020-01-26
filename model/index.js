const User = require("./user");
const Kyc = require("./kyc");
const Requirement = require("./requirement");
const Attachment = require("./attachment");

User.hasMany(Requirement, {
  foreignKey:'creatorId', sourceKey:'id', as: 'requirements'
})
Requirement.belongsTo(User, {
  foreignKey:'creatorId', targetKey:'id', as: 'creator'
})

Requirement.hasMany(Attachment, {
  foreignKey:'requirementId', sourceKey:'id', as: 'attachments'
})
Attachment.belongsTo(Requirement, {
  foreignKey:'requirementId', targetKey:'id', as: 'requirement'
})

User.hasMany(Attachment, {
  foreignKey:'creatorId', sourceKey:'id', as: 'attachments'
})
Attachment.belongsTo(User, {
  foreignKey:'creatorId', targetKey:'id', as: 'creator'
})

const RequirementStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  HIDDEN: 'HIDDEN'
}

const UserAttrs = ['id', 'username', 'weiboid', 'name', 'kycState', 'role', 'createdAt', 'updatedAt']

module.exports = {
  User: User,
  Kyc: Kyc,
  Requirement: Requirement,
  Attachment: Attachment,

  RequirementStatus: RequirementStatus,
  UserAttrs: UserAttrs
};
