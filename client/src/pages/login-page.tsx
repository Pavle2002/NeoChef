import LoginForm from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Login() {
  return (
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-end gap-2">
        <Button variant="ghost" asChild>
          <Link to="/register">Sign up</Link>
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
