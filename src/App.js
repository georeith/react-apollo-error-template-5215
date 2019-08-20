import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const ADD_PERSON = gql`
  mutation AddPerson($name: String!) {
    addPerson(name: $name) {
      id
      name
    }
  }
`;

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
    }
  }
`;

export default function App() {
  const [personToAddName, setPersonToAddName] = useState("");
  const { loading, data } = useQuery(ALL_PEOPLE);
  const { people } = data;
  const [addPerson] = useMutation(ADD_PERSON, {
    update(cache, { data }) {
      const cachedData = cache.readQuery({ query: ALL_PEOPLE });
      console.log(data);
      cache.writeQuery({
        query: ALL_PEOPLE,
        data: {
          people: [...cachedData.people, data.addPerson]
        }
      });
    }
  });

  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>
        This application can be used to demonstrate an error in Apollo Client.
      </p>
      <h2>Names</h2>
      {loading ? (
        <p>Loading…</p>
      ) : (
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
      )}
    </main>
  );
}
