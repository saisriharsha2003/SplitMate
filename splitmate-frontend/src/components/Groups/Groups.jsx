import React, { useState } from "react";
import {
  Wrapper,
  Content,
  Header,
  AddButton,
  GroupsList,
  GroupCard,
  GroupInfo,
  GroupName,
  GroupMembers,
  GroupBalance,
  Actions,
  ActionButton,
} from "./GroupsStyle";
import Sidebar from "../Sidebar/Sidebar";
import { FaEye, FaHandHoldingUsd, FaPlus } from "react-icons/fa";

const dummyGroups = [
  { id: 1, name: "Roommates", balance: 120, members: 4 },
  { id: 2, name: "Trip to Goa", balance: 75, members: 6 },
  { id: 3, name: "Office Lunch", balance: 30, members: 3 },
];

const Groups = () => {
  const [groups, setGroups] = useState(dummyGroups);

  return (
    <Wrapper>
      <Sidebar />

      <Content>
        <Header>
          <h1>Groups</h1>
          <AddButton>
            <FaPlus /> Add New Group
          </AddButton>
        </Header>

        <GroupsList>
          {groups.map((group) => (
            <GroupCard key={group.id}>
              <GroupInfo>
                <GroupName>{group.name}</GroupName>
                <GroupMembers>{group.members} members</GroupMembers>
              </GroupInfo>
              <GroupBalance>${group.balance}</GroupBalance>
              <Actions>
                <ActionButton title="View">
                  <FaEye />
                </ActionButton>
                <ActionButton title="Settle Up">
                  <FaHandHoldingUsd />
                </ActionButton>
              </Actions>
            </GroupCard>
          ))}
        </GroupsList>
      </Content>
    </Wrapper>
  );
};

export default Groups;
