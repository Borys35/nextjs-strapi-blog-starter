module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '54f271093a1cc15445aa32d459569b9e'),
  },
});
