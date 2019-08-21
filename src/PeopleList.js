import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const ADD_PERSON = gql`
  mutation AddPerson($name: String!) {
    addPerson(name: $name) {
      id
      name
    }
  }
`;

export default function PeopleList({ people, query }) {
  const [personToAddName, setPersonToAddName] = useState("");
  const [addPerson] = useMutation(ADD_PERSON, {
    update(cache, { data }) {
      const cachedData = cache.readQuery({ query });
      cache.writeQuery({
        query,
        data: {
          people: [...cachedData.people, data.addPerson]
        }
      });
    }
  });

  return (
    <>
      <ul>
        {people.map(person => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
      <input
        onChange={e => {
          setPersonToAddName(e.target.value);
        }}
        type="text"
        value={personToAddName}
      />
      <button
        onClick={() => {
          if (personToAddName)
            addPerson({
              variables: { name: personToAddName },
              optimisticResponse: {
                addPerson: {
                  id: people.length + 1,
                  name: personToAddName,
                  __typename: "Person"
                }
              }
            });
        }}
      >
        Add person
      </button>
    </>
  );
}
