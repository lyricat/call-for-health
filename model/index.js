const User = require("./user");
const Kyc = require("./kyc");
const Requirement = require("./requirement");
const Product = require("./product");

const RequirementStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  HIDDEN: 'HIDDEN'
}

module.exports = {
  User: User,
  Kyc: Kyc,
  Requirement: Requirement,
  Product: Product,
  RequirementStatus: RequirementStatus
};
