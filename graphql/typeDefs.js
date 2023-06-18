const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Tweet {
    id: ID!
    tweet: String
    author: String!
  }

  type Following {
    id: ID!
    username: String
    following: [String] 
  }

  type Query {
    hello: String
    getAlltweets: [Tweet]
    getAllUsers: [User]
    getFollowings(username: String): Following
  }
`;

module.exports = typeDefs;