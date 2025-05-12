import { Button } from "@/components/ui/button";
import useLogout from "@/hooks/useLogout";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();

  return (
    <Button
      onClick={() =>
        logout(undefined, {
          onSuccess: () => navigate("/login", { replace: true }),
        })
      }
    >
      Logout
    </Button>
  );
}
