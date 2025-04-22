import RegisterForm from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Register() {
  return (
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-end gap-2">
        <Button variant="ghost" asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
