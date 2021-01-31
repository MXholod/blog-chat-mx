function basicDetails(user) {
  const {
    id, login, email, role, created, updated, isVerified, passwordHash, isAdmin, chatBan, blogBan
  } = user;
  return {
    id, login, email, role, created, updated, isVerified, passwordHash, isAdmin, chatBan, blogBan
  };
}

module.exports = basicDetails;
