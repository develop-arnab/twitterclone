const User = require("../models/user");
const Tweet = require("../models/Tweet");
const Following = require("../models/Following");
const resolvers = {
    Query: {
  
      hello:() => {
        return 'Hello World'
      },
  
      getAlltweets : async () =>  {
        return await Tweet.find();
      },
      getAllUsers : async () => {
        try {
          return await User.find() || new ValidationError('Users not found');
        } catch (error) {
          throw new ApolloError(error);
        }
      },
      getFollowings : async (_,{username}) => {
        try {
          return await Following.findOne({username: username}) || new ValidationError('Followers not found');
        } catch (error) {
          throw new ApolloError(error);
        }
      }
    },
  };
  module.exports = resolvers;
  