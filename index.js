const { ApolloServer, gql } = require("apollo-server");
const { events, users, locations, participants } = require("./data");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const { nanoid } = require("nanoid");

const typeDefs = gql`
  # User
  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event]!
  }

  input CreateUserInput {
    username: String!
    email: String!
  }

  input UpdateUserInput {
    username: String
    email: String
  }

  type DeleteAllOutput {
    count: Int!
  }

  # Participant

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  input CreateParticipantInput {
    user_id: ID!
    event_id: ID!
  }

  input UpdateParticipantInput {
    user_id: ID
    event_id: ID
  }

  # Location

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
    event_id: ID!
  }

  input CreateLocationInput {
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
    event_id: ID!
  }

  input UpdateLocationInput {
    name: String
    desc: String
    lat: Float
    lng: Float
    event_id: ID
  }
  # Event

  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!

    user_id: ID!
    user: User!

    location: Location!
    location_id: ID!

    participant: [Participant!]!
  }

  input addEventInput {
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
  }

  input UpdateEventInput {
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: ID
    user_id: ID
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!

    events: [Event!]!
    event(id: ID!): Event!

    locations: [Location!]!
    location(id: ID!): Location!

    participants: [Participant!]!
    participant(id: ID!): Participant!
  }

  type Mutation {
    # User
    createUser(data: CreateUserInput): User!
    updateUser(id: ID!, data: UpdateUserInput): User!
    deleteUser(id: ID!): User
    deleteAllUsers: DeleteAllOutput!
    # Participant
    createParticipant(data: CreateParticipantInput): Participant!
    updateParticipant(id: ID!, data: UpdateParticipantInput): Participant!
    deleteParticipant(id: ID!): Participant!
    deleteAllParticipants: DeleteAllOutput!
    # Location
    createLocation(data: CreateLocationInput): Location!
    updateLocation(id: ID!, data: UpdateLocationInput): Location!
    deleteLocation(id: ID!): Location!
    deleteAllLocations: DeleteAllOutput!
    # Event
    addEvent(data: addEventInput!): Event!
    updateEvent(id: ID!, data: UpdateEventInput): Event!
    deleteEvent(id: ID!): Event!
    deleteAllEvents: DeleteAllOutput!
  }
`;

const resolvers = {
  Mutation: {
    // User
    createUser: (parent, { data: { username, email } }) => {
      const user = {
        id: nanoid(),
        username,
        email,
      };
      users.push(user);
      return user;
    },
    updateUser: (parent, { id, data }) => {
      const user_index = users.findIndex((user) => user.id == id);
      if (user_index === -1) {
        throw new Error("User not found.");
      }
      const updated_user = (users[user_index] = {
        ...users[user_index],
        ...data,
      });
      return updated_user;
    },
    deleteUser: (parent, { id }) => {
      const user_index = users.findIndex((user) => user.id == id);
      if (!user_index) {
        throw new Error("There is no user");
      }
      const deleted_user = users[user_index];
      users.splice(user_index, 1);
      return deleted_user;
    },
    deleteAllUsers: () => {
      const length = users.length;
      users.splice(0, length);
      return {
        count: length,
      };
    },

    // Participant
    createParticipant: (parent, { data: { user_id, event_id } }) => {
      const participant = {
        id: nanoid(),
        user_id,
        event_id,
      };
      participants.push(participant);
      return participant;
    },
    updateParticipant: (parent, { id, data }) => {
      const participant_index = participants.findIndex(
        (participant) => participant.id == id
      );
      if (participant_index === -1) {
        throw new Error("participant not found.");
      }
      const updated_participant = (participants[participant_index] = {
        ...participants[participant_index],
        ...data,
      });
      return updated_participant;
    },
    deleteParticipant: (parent, { id }) => {
      const participant_index = participants.findIndex(
        (participant) => participant.id == id
      );
      if (!participant_index) {
        throw new Error("There is no participant");
      }
      const deleted_participant = participants[participant_index];
      participants.splice(participant_index, 1);
      return deleted_participant;
    },
    deleteAllParticipants: () => {
      const length = participants.length;
      participants.splice(0, length);
      return {
        count: length,
      };
    },
    // Location
    createLocation: (
      parent,
      { data: { title, desc, date, from, to, location_id, user_id } }
    ) => {
      const location = {
        id: nanoid(),
        title,
        desc,
        date,
        from,
        to,
        location_id,
        user_id,
      };
      users.push(location);
      return location;
    },
    updateLocation: (parent, { id, data }) => {
      const location_index = locations.findIndex(
        (location) => location.id == id
      );
      if (location_index === -1) {
        throw new Error("location not found.");
      }
      const updated_location = (locations[location_index] = {
        ...locations[location_index],
        ...data,
      });
      return updated_location;
    },
    deleteLocation: (parent, { id }) => {
      const location_index = locations.findIndex(
        (location) => location.id == id
      );
      if (!location_index) {
        throw new Error("There is no location");
      }
      const deleted_location = locations[location_index];
      locations.splice(location_index, 1);
      return deleted_location;
    },
    deleteAllLocations: () => {
      const length = locations.length;
      locations.splice(0, length);
      return {
        count: length,
      };
    },
    // Event
    addEvent: (parent, { data }) => {
      const event = {
        id: nanoid(),
        ...data,
      };

      events.push(event);

      return event;
    },
    updateEvent: (parent, { id, data }) => {
      const event_index = events.findIndex((event) => event.id == id);
      if (event_index === -1) {
        throw new Error("event not found.");
      }
      const updated_event = (events[event_index] = {
        ...events[event_index],
        ...data,
      });
      return updated_event;
    },
    deleteEvent: (parent, { id }) => {
      const event_index = events.findIndex((event) => event.id == id);
      if (!event_index) {
        throw new Error("There is no event");
      }
      const deleted_event = events[event_index];
      events.splice(event_index, 1);
      return deleted_event;
    },
    deleteAllEvents: () => {
      const length = events.length;
      events.splice(0, length);
      return {
        count: length,
      };
    },
  },

  Query: {
    // Users
    users: () => users,
    user: (parents, args) => users.find((user) => user.id == args.id),
    // Events
    events: () => events,
    event: (parents, args) => events.find((event) => event.id == args.id),

    // Locations
    locations: () => locations,
    location: (parents, args) =>
      locations.find((location) => location.id == args.id),
    // Participant
    participants: () => participants,
    participant: (parents, args) =>
      participants.find((participant) => participant.id == args.id),
  },

  User: {
    events: (parents, args) =>
      events.filter((event) => event.user_id == parents.id),
  },
  Event: {
    user: (parents, args) => users.find((user) => user.id == parents.user_id),
    location: (parents, args) =>
      locations.find((location) => location.id == parents.location_id),
    participant: (parents, args) =>
      participants.filter((participant) => participant.event_id == parents.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      // option
    }),
  ],
});

server
  .listen()
  .then(({ url }) => console.log(`Graphql server is up at ${url}`));
