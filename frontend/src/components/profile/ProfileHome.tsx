import { useState, useEffect } from "react";
import EmailIcon from "../../assets/svg/EmailIcon";
import UserLogo from "../../assets/svg/UserLogo";
import { LOGO_URL } from "../../constants/URL";
import { ProfilePageWrappers } from "../../wrappers/ProfilePageWrappers";
import { useUserManager } from "../../hooks/useUserManager";

export const AccountHome = () => {
    const [userFirstName, setUserFirstName] = useState<string>("");
    const [userLastName, setUserLastName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [saveStatus, setSaveStatus] = useState<{
        firstName: "idle" | "saving" | "success" | "error";
        lastName: "idle" | "saving" | "success" | "error";
        email: "idle" | "saving" | "success" | "error";
    }>({
        firstName: "idle",
        lastName: "idle",
        email: "idle"
    });

    const {
        firstName,
        lastName,
        email,
        isFieldLoading,
        fieldError,
        updateUserProfile,
        refreshUserData
    } = useUserManager();

    useEffect(() => {
        if (firstName) setUserFirstName(firstName);
        if (lastName) setUserLastName(lastName);
        if (email) setUserEmail(email);
    }, [firstName, lastName, email]);

    const loggedUserId = localStorage.getItem('remembered_logged_id') || '';

    const handleSaveAll = async () => {
        // Update everything that has changed
        const updates: Record<string, string> = {};
        let hasChanges = false;

        if (userFirstName !== firstName) {
            updates.first_name = userFirstName;
            hasChanges = true;
        }

        if (userLastName !== lastName) {
            updates.last_name = userLastName;
            hasChanges = true;
        }

        if (userEmail !== email) {
            updates.email = userEmail;
            hasChanges = true;
        }

        if (!hasChanges) {
            setIsEditing(false);
            return;
        }

        // Set all fields to saving state
        setSaveStatus({
            firstName: updates.first_name ? "saving" : "idle",
            lastName: updates.last_name ? "saving" : "idle",
            email: updates.email ? "saving" : "idle"
        });

        const result = await updateUserProfile(loggedUserId, updates);

        if (result.success) {
            // Set success state for all updated fields
            setSaveStatus({
                firstName: updates.first_name ? "success" : "idle",
                lastName: updates.last_name ? "success" : "idle",
                email: updates.email ? "success" : "idle"
            });

            setIsEditing(false);

            // Reset statuses after delay
            setTimeout(() => {
                setSaveStatus({
                    firstName: "idle",
                    lastName: "idle",
                    email: "idle"
                });
            }, 3000);
        } else {
            // Set error state for all updated fields
            setSaveStatus({
                firstName: updates.first_name ? "error" : "idle",
                lastName: updates.last_name ? "error" : "idle",
                email: updates.email ? "error" : "idle"
            });
        }
    };

    if (isFieldLoading) {
        return (
            <ProfilePageWrappers>
                <div className="flex justify-center items-center w-full h-64">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </ProfilePageWrappers>
        );
    }

    if (fieldError) {
        return (
            <ProfilePageWrappers>
                <div className="alert alert-error">
                    <p>Error loading profile: {fieldError}</p>
                    <button className="btn btn-sm" onClick={refreshUserData}>
                        Retry
                    </button>
                </div>
            </ProfilePageWrappers>
        );
    }

    return (
        <ProfilePageWrappers>
            <div className="flex flex-row max-sm:flex-col justify-center w-full gap-5">
                <img
                    src={LOGO_URL}
                    className="max-w-sm rounded-3xl shadow-2xl w-52 h-52"
                    alt="User profile"
                />
                <div className="flex flex-col gap-5">
                    <div className="flex flex-row gap-5 max-sm:flex-col">
                        <div className="relative w-full">
                            <label className="input input-bordered flex items-center gap-2">
                                <UserLogo />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userFirstName}
                                        onChange={(e) => setUserFirstName(e.target.value)}
                                        className="grow focus:outline-none"
                                        placeholder="First Name"
                                    />
                                ) : (
                                    <span className="grow">{userFirstName || "First Name"}</span>
                                )}
                            </label>
                            {saveStatus.firstName === "saving" && (
                                <span className="absolute right-2 top-3 loading loading-spinner loading-sm"></span>
                            )}
                            {saveStatus.firstName === "success" && (
                                <span className="absolute right-2 top-3 text-success">✓</span>
                            )}
                            {saveStatus.firstName === "error" && (
                                <span className="absolute right-2 top-3 text-error">!</span>
                            )}
                        </div>

                        <div className="relative w-full">
                            <label className="input input-bordered flex items-center gap-2">
                                <UserLogo />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={userLastName}
                                        onChange={(e) => setUserLastName(e.target.value)}
                                        className="grow focus:outline-none"
                                        placeholder="Last Name"
                                    />
                                ) : (
                                    <span className="grow">{userLastName || "Last Name"}</span>
                                )}
                            </label>
                            {saveStatus.lastName === "saving" && (
                                <span className="absolute right-2 top-3 loading loading-spinner loading-sm"></span>
                            )}
                            {saveStatus.lastName === "success" && (
                                <span className="absolute right-2 top-3 text-success">✓</span>
                            )}
                            {saveStatus.lastName === "error" && (
                                <span className="absolute right-2 top-3 text-error">!</span>
                            )}
                        </div>
                    </div>

                    <div className="relative w-full">
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <EmailIcon />
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    className="grow focus:outline-none"
                                    placeholder="Email"
                                />
                            ) : (
                                <span className="grow">{userEmail || "Email"}</span>
                            )}
                        </label>
                        {saveStatus.email === "saving" && (
                            <span className="absolute right-2 top-3 loading loading-spinner loading-sm"></span>
                        )}
                        {saveStatus.email === "success" && (
                            <span className="absolute right-2 top-3 text-success">✓</span>
                        )}
                        {saveStatus.email === "error" && (
                            <span className="absolute right-2 top-3 text-error">!</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-5 justify-center">
                {isEditing ? (
                    <button
                        className="btn btn-primary"
                        onClick={handleSaveAll}
                    >
                        Save
                    </button>
                ) : (
                    <button
                        className="btn btn-primary"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                )}

                <button
                    className="btn btn-secondary"
                    onClick={refreshUserData}
                >
                    Refresh
                </button>
            </div>
        </ProfilePageWrappers>
    );
}