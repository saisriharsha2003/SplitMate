import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import Sidebar from "../Sidebar/Sidebar";
import {
  Content,
  Header,
  AddButton,
  GroupsList,
  GroupCard,
  GroupInfo,
  GroupName,
  GroupMembers,
  Actions,
  ActionButton,
} from "./GroupsStyle";
import {
  FaEye,
  FaHandHoldingUsd,
  FaPlus,
  FaShareAlt,
  FaUserPlus,
} from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../config";

import JoinGroupModal from "./JoinGroupModal";
import ShareInviteModal from "./ShareInviteModal";

const Groups = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [inviteCodeToShow, setInviteCodeToShow] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const refreshGroups = () => setRefreshFlag((p) => !p);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/groups`);
        console.log("Fetched groups:", res.data);
        setGroups(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching groups:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [refreshFlag]);

  const openInviteModal = (code) => {
    setInviteCodeToShow(code);
    setInviteModalOpen(true);
  };
  const closeInviteModal = () => setInviteModalOpen(false);

  const openJoinModal = () => setJoinModalOpen(true);
  const closeJoinModal = () => setJoinModalOpen(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Nav toggleSidebar={() => setIsSidebarOpen((p) => !p)} />

      <div style={{ display: "flex", flex: 1, paddingTop: "60px" }}>
        <Sidebar isOpen={isSidebarOpen} />

        <Content
          style={{
            marginLeft: isSidebarOpen ? "220px" : "80px",
            transition: "margin 0.3s ease",
            flex: 1,
          }}
        >
          <Header>
            <h1>Groups</h1>
            <AddButton onClick={() => navigate("/groups/new")}>
              <FaPlus /> Add New Group
            </AddButton>
          </Header>

          {loading ? (
            <p>Loading groups...</p>
          ) : groups.length === 0 ? (
            <p>No groups found. Start by creating one!</p>
          ) : (
            <GroupsList>
              {groups.map((group) => (
                <GroupCard key={group._id}>
                  <GroupInfo>
                    <GroupName>{group.name}</GroupName>
                    <GroupMembers>
                      {group.members?.length || 0} members
                    </GroupMembers>
                  </GroupInfo>
                  <Actions>
                    <ActionButton
                      title="View"
                      onClick={() => navigate(`/groups/${group._id}`)}
                    >
                      <FaEye />
                    </ActionButton>
                    <ActionButton title="Settle Up">
                      <FaHandHoldingUsd />
                    </ActionButton>
                    {group.createdBy?.username === username ||
                    group.members?.some(
                      (m) => m.user?.username === username
                    ) ? (
                      <ActionButton
                        title="Share Invite"
                        onClick={() => openInviteModal(group.joinCode)}
                      >
                        <FaShareAlt />
                      </ActionButton>
                    ) : (
                      <ActionButton title="Join Group" onClick={openJoinModal}>
                        <FaUserPlus />
                      </ActionButton>
                    )}
                  </Actions>
                </GroupCard>
              ))}
            </GroupsList>
          )}

          <JoinGroupModal
            isOpen={joinModalOpen}
            onClose={closeJoinModal}
            refreshGroups={refreshGroups}
          />

          <ShareInviteModal
            isOpen={inviteModalOpen}
            onClose={closeInviteModal}
            inviteCode={inviteCodeToShow}
          />
        </Content>
      </div>
    </div>
  );
};

export default Groups;
