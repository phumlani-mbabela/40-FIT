import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateMe } from "../api/services/users";

export default function UserProfilePage() {
  const queryClient = useQueryClient();

  // --- Load current user profile ---
  const {
    data: me,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  // --- Local form state ---
  const [form, setForm] = React.useState({
    name: "",
    nickname: "",
    dob: "",
    address: "",
  });

  const [status, setStatus] = React.useState(null); // "idle" | "success" | "error"

  React.useEffect(() => {
    if (me) {
      setForm({
        name: me.name || "",
        nickname: me.nickname || "",
        dob: me.dob || "",
        address: me.address || "",
      });
    }
  }, [me]);

  // --- Save profile (updateMe goes to /v1/users/me via your backend) ---
  const mutation = useMutation({
    mutationFn: (payload) => updateMe(payload),
    onSuccess: () => {
      setStatus("success");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: () => {
      setStatus("error");
    },
  });

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status) setStatus(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!me) return;
    // Merge existing profile with form fields so we don't lose other fields
    const payload = { ...me, ...form };
    mutation.mutate(payload);
  };

  // --- UI states ---
  if (isLoading) {
    return (
      <div className="page-content bg-white py-5">
        <div className="container">
          <p>Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-content bg-white py-5">
        <div className="container">
          <div className="alert alert-danger">
            Failed to load profile.
            {error?.message && <div className="small mt-1">{error.message}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content bg-white py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-9">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-dark text-white">
                <h4 className="mb-0">My Profile</h4>
              </div>
              <div className="card-body">
                {status === "success" && (
                  <div className="alert alert-success">
                    Profile updated successfully.
                  </div>
                )}
                {status === "error" && (
                  <div className="alert alert-danger">
                    Something went wrong saving your profile. Please try again.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Email (read-only if present) */}
                  {me?.email && (
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        value={me.email}
                        disabled
                      />
                      <div className="form-text">
                        Email is managed by your account provider.
                      </div>
                    </div>
                  )}

                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">Full name</label>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="e.g. Phumlani Mbabela"
                    />
                  </div>

                  {/* Nickname / Display name */}
                  <div className="mb-3">
                    <label className="form-label">Display name / Nickname</label>
                    <input
                      className="form-control"
                      value={form.nickname}
                      onChange={handleChange("nickname")}
                      placeholder="This is what we’ll show in the app"
                    />
                  </div>

                  {/* DOB */}
                  <div className="mb-3">
                    <label className="form-label">Date of birth</label>
                    <input
                      className="form-control"
                      type="date"
                      value={form.dob}
                      onChange={handleChange("dob")}
                    />
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      className="form-control"
                      value={form.address}
                      onChange={handleChange("address")}
                      placeholder="City / area (optional)"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={mutation.isLoading}
                  >
                    {mutation.isLoading ? "Saving…" : "Save changes"}
                  </button>
                </form>
              </div>
              <div className="card-footer text-muted small">
                This is your minimal FortyPlusFit profile. You can extend it
                later with goals, metrics, and preferences.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
