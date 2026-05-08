import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 p-10 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
          Welcome
        </h1>
        <p className="text-sm text-zinc-400 mb-8">Sign in to continue</p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 border border-zinc-200 dark:border-zinc-600 rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
