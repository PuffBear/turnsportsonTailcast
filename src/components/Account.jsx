import { useState } from "react";

export default function AccountPage() {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-bgDark1 text-white p-6">
      <div className="max-w-2xl mx-auto mt-12">
        <h1 className="text-3xl font-bold mb-6">Your Account</h1>

        {!user ? (
          <>
            <p className="mb-4">Log in to manage your subscription, view predictions, or update your info.</p>
            <button className="bg-bgDark3 text-white px-4 py-2 rounded hover:bg-bgDark2 transition">
              Log In with Google
            </button>
            <p className="text-sm text-gray-400 mt-2">No account? We’ll create one for you on login.</p>
          </>
        ) : (
          <>
            <p>Welcome, {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Subscription: {user.plan}</p>
            <button className="mt-4 text-sm underline text-red-400">Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
