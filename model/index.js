const User = require("./user");
const Kyc = require("./kyc");
const Requirement = require("./requirement");

User.hasMany(Requirement, {
  foreignKey:'creatorId', sourceKey:'id', as: 'requirements'
})

Requirement.belongsTo(User, {
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
  RequirementStatus: RequirementStatus,
  UserAttrs: UserAttrs
};
