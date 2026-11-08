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
  GroupIdentity,
  GroupIcon,
  GroupName,
  GroupMembers,
  Actions,
  ActionButton,
  EmptyState,
  EmptyStateIcon,
  HeaderActions,
  LoadingState,
} from "./GroupsStyle";
import {
  FaEye,
  FaHandHoldingUsd,
  FaPlus,
  FaShareAlt,
  FaTrash,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
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
        const res = await axios.get(`${BASE_URL}/api/user/groups`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
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

  const handleDeleteGroup = async (group) => {
    const confirmed = window.confirm(
      `Delete "${group.name}" and all its expenses? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/api/user/groups/${group._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Group deleted successfully");
      refreshGroups();
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not delete group");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Nav toggleSidebar={() => setIsSidebarOpen((p) => !p)} />

      <div style={{ display: "flex", flex: 1, paddingTop: "60px" }}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <Content
          style={{
            marginLeft: isSidebarOpen ? "220px" : "80px",
            transition: "margin 0.3s ease",
            flex: 1,
          }}
        >
          <Header>
            <div>
              <h1>Your groups</h1>
              <p>Keep shared plans and expenses organized in one place.</p>
            </div>
            <HeaderActions>
              <AddButton onClick={openJoinModal}>
                <FaUserPlus /> Join Group
              </AddButton>
              <AddButton $primary onClick={() => navigate("/groups/new")}>
                <FaPlus /> Add New Group
              </AddButton>
            </HeaderActions>
          </Header>

          {loading ? (
            <LoadingState>Loading your groups...</LoadingState>
          ) : groups.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <FaUsers />
              </EmptyStateIcon>
              <h2>No groups yet</h2>
              <p>
                You’re not part of any groups right now. Create a group or join
                one with an invite to start sharing expenses.
              </p>
            </EmptyState>
          ) : (
            <GroupsList>
              {groups.map((group, index) => (
                <GroupCard key={group._id} $index={index}>
                  <GroupInfo>
                    <GroupIdentity>
                      <GroupIcon className="group-icon" $variant={index % 3}><FaUsers /></GroupIcon>
                      <GroupName>{group.name}</GroupName>
                    </GroupIdentity>
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
                    <ActionButton
                      title="Settle Up"
                      aria-label={`Settle up in ${group.name}`}
                      onClick={() => navigate(`/groups/${group._id}#settle-up`)}
                    >
                      <FaHandHoldingUsd />
                    </ActionButton>
                    {group.members?.some((m) => m.user?.username === username) && (
                      <ActionButton
                        title="Share Invite"
                        onClick={() => openInviteModal(group.joinCode)}
                      >
                        <FaShareAlt />
                      </ActionButton>
                    )}
                    {(group.members?.some(
                      (member) =>
                        member.user?.username === username &&
                        member.role === "admin"
                    ) || group.createdBy?.username === username) && (
                      <ActionButton
                        title="Delete Group"
                        aria-label={`Delete ${group.name}`}
                        onClick={() => handleDeleteGroup(group)}
                      >
                        <FaTrash />
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
