import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6 md:p-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-800">Welcome Back</h1>
          <p className="text-gray-600 mt-1 text-sm">Log in to continue learning with StudyBuddy</p>
        </div>

        <LoginForm />

        <div className="text-sm text-center text-gray-500">
          
          
        </div>
      </div>
    </div>
  );
}
