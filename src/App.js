import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import PeopleList from "./PeopleList";

const ALL_PEOPLE1 = gql`
  query AllPeople1 {
    people {
      id
      name
    }
  }
`;
const ALL_PEOPLE2 = gql`
  query AllPeople2 {
    people {
      id
      name
    }
  }
`;

export default function App() {
  // Clearly this is uneccesary in the case of this application but it is for illustration purpose and is supposed
  // to simulate a larger application which may be reading overlapping data using separate query instances
  const {
    loading: loading1,
    data: { people: people1 }
  } = useQuery(ALL_PEOPLE1);

  const {
    loading: loading2,
    data: { people: people2 }
  } = useQuery(ALL_PEOPLE2);

  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>To reproduce the issue follow these instructions:</p>
      <ul>
        <li>
          Open the developer tools in your browser and set network to offline.
        </li>
        <li>Add a person to one of the lists.</li>
        <li>
          See that it is removed from one of the lists but not the other after
          the network error.
        </li>
      </ul>
      <h2>Names</h2>
      <p>
        <b>Note:</b> If you send the value <b>Jeff</b> the server will respond
        with a GraphQl error.
      </p>
      {loading1 ? (
        <p>Loading…</p>
      ) : (
        <PeopleList people={people1} query={ALL_PEOPLE1} />
      )}
      {loading2 ? (
        <p>Loading…</p>
      ) : (
        <PeopleList people={people2} query={ALL_PEOPLE2} />
      )}
    </main>
  );
}
