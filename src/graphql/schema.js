const {
  GraphQLError,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} = require('graphql');

const PersonType = new GraphQLObjectType({
  name: "Person",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString }
  }
});

const PeopleType = new GraphQLList(PersonType);

const peopleData = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sara Smith" },
  { id: 3, name: "Budd Deey" }
];

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    people: {
      type: PeopleType,
      resolve: () => peopleData
    }
  }
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addPerson: {
      type: PersonType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (value, { name }) => {
        console.log(value, { name });
        if (name === "Jeff") return new GraphQLError("NO!");
        const person = {
          id: peopleData.length + 1,
          name
        };
        peopleData.push(person);
        return person;
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: QueryType, mutation: MutationType });
