import { Outlet, useNavigate } from "react-router";
import useUser from "@/hooks/useUser";

export default function ProtectedRoute() {
  const { isSuccess, isError, isLoading } = useUser();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading....</p>;
  if (isError) navigate("/login", { replace: true });
  if (isSuccess) return <Outlet />;
}
