import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getSession } from "next-auth/react";
import { useTheme } from 'next-themes';

export const EditUser = ({ user, onClose }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role || "");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [session, setSession] = useState(null);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Name is required");
      return;
    }

    if (!session || (!session.user.isAdmin && session.user.id !== user.id)) {
      setError("You are not authorized to perform this action");
      return;
    }

    const data = {
      name,
      email,
      role,
    };

    if (password) {
      data.password = password;
    }

    const response = await fetch(`/api/user/update/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setSuccess("User updated successfully");
      onClose();
    } else {
      setError("Failed to update user");
    }
  };

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl">
        <div className={`relative flex flex-col w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-0 rounded-lg shadow-lg outline-none focus:outline-none`}>
          <div className="flex items-center justify-between p-3 ">
            <h3 className="text-xl font-semibold">Edit User</h3>
          </div>
          <div className="relative p-6 flex-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 p-2">
                  <div className="mb-4">
                    <Label htmlFor="name" className={`${theme === 'dark' ? 'text-white' : ''}`}>Name</Label>
                    <Input
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="email" className={`${theme === 'dark' ? 'text-white' : ''}`}>Email</Label>
                    <Input
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 p-2">
                  <div className="mb-4">
                    <Label htmlFor="password" className={`${theme === 'dark' ? 'text-white' : ''}`}>Password</Label>
                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="role" className={`${theme === 'dark' ? 'text-white' : ''}`}>Role</Label>
                    <Input
                      label="Role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center p-3 space-x-4">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save
                </Button>
                &nbsp;&nbsp;
                <Button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => onClose()}
                >
                  Cancel
                </Button>
              </div>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
