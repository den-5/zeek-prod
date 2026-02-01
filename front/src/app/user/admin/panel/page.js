"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [foundedUser, setFoundedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [balance, setBalance] = useState(0);
  const [users, setUsers] = useState([]);
  const [adminEmail, setAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [isAdminCreating, setIsAdminCreating] = useState(false);
  useEffect(() => {
    const checkAdminToken = async () => {
      try {
        const token = localStorage.getItem("admintoken");

        if (!token) {
          return router.push("/user/admin/auth");
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/check`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const { token } = await response.json();
          localStorage.setItem("admintoken", token);
          return;
        }
        router.push("/user/admin/auth");
      } catch (error) {
      }
    };
    checkAdminToken();
    const intervalId = setInterval(checkAdminToken, 60000);

    return () => clearInterval(intervalId);
  }, []);

  async function getUsers() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const _users = await response.json();
        setUsers(_users);
      }
    } catch (error) {
    }
  }
  async function findUser() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/getUser`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        }
      );
      if (response.ok) {
        const user = await response.json();
        setFoundedUser(user);
      }
    } catch (error) {
    }
  }
  async function deleteUser() {
    const isConfirmed = confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/deleteUser`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        }
      );
      if (response.ok) {
        setFoundedUser(null);
        setUserEmail("");
      }
    } catch (error) {
    }
  }

  async function changePassword() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/changePassword`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail, password: newPassword }),
        }
      );
      if (response.ok) {
        setNewPassword("");
      }
    } catch (error) {
    }
  }
  async function changeBalance() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/changeBalance`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail, balance }),
        }
      );
      if (response.ok) {
        setBalance(0);
      }
    } catch (error) {
    }
  }
  async function createAdmin() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/createAdmin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: adminEmail,
            password: newAdminPassword,
          }),
        }
      );
      if (response.ok) {
        console.log("Admin created successfully");
        setIsAdminCreating(false);
      }
    } catch (error) {
      console.error("An error occurred during admin creation:", error);
    }
  }

  return (
    <div>
      <h1 className="text-center text-3xl">Admin panel</h1>
      <div>
        {isAdminCreating ? (
          <>
            <h2>Create new admin</h2>
            <input
              type="text"
              placeholder="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value.toLowerCase())}
              className="border border-gray-400 p-1 text-black"
            />
            <input
              type="text"
              placeholder="password"
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
              className="border border-gray-400 p-1 text-black"
            />
            <button
              onClick={createAdmin}
              className="bg-blue-500 text-white hover:bg-blue-700 p-1 rounded-md my-4 ml-4"
            >
              Create admin
            </button>
          </>
        ) : (
          <button
            onClick={(e) => setIsAdminCreating(true)}
            className="bg-blue-500 text-white hover:bg-blue-700 p-1 rounded-md mb-8"
          >
            Add new admin
          </button>
        )}
        <h2>Seach user</h2>
        <input
          type="text"
          placeholder="user email..."
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value.toLowerCase())}
          className="border border-gray-400 p-1 text-black"
        />
        <button
          className="bg-blue-500 text-white hover:bg-blue-700 p-1 rounded-md my-4 ml-4"
          onClick={findUser}
        >
          Find user
        </button>
        <div>
          {foundedUser && (
            <div>
              <h2 className="text-xl italic">User info:</h2>
              <div>Username: {foundedUser.username}</div>
              <div>Email: {foundedUser.email}</div>

              <br />
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="new password..."
                className="border border-gray-400 p-1 text-black"
              />
              <button
                className="bg-blue-500 text-white hover:bg-blue-700 p-1 rounded-md my-4 ml-4"
                onClick={changePassword}
              >
                Change password
              </button>
              <br />
              <input
                type="text"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="new user balance..."
                className="border border-gray-400 p-1 text-black"
              />
              <button
                className="bg-blue-500 text-white hover:bg-blue-700 p-1 rounded-md my-4 ml-4"
                onClick={changeBalance}
              >
                Change balance
              </button>
              <br />
              <button
                className="bg-blue-500 text-white hover:bg-blue-700 p-2 rounded-md my-4 mr-10"
                onClick={() => {
                  setFoundedUser(null);
                  setUserEmail("");
                }}
              >
                Hide user
              </button>
              <button
                className="bg-red-500 text-white hover:bg-red-700 p-2 rounded-md my-4"
                onClick={deleteUser}
              >
                Delete user
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        {users.length === 0 ? (
          <button
            className="bg-yellow-500 text-white hover:bg-yellow-700 p-2 rounded-md my-4"
            onClick={getUsers}
          >
            Get users
          </button>
        ) : (
          <>
            <button
              className="bg-yellow-500 text-white hover:bg-yellow-700 p-2 rounded-md my-4"
              onClick={() => setUsers([])}
            >
              Hide users
            </button>
            <div className="m-10">
              <h2 className="text-3xl text-center mb-8">User List</h2>
              <div className="flex flex-row justify-between items-center italic underline">
                <div>Username: </div>
                <div>Email: </div>
                <div>Balance: </div>
              </div>
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex flex-row justify-between items-center"
                >
                  <div>{user.username}</div>
                  <div>{user.email}</div>
                  <div>{user.balance}</div>
                </div>
              ))}{" "}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
