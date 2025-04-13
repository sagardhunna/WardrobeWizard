import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER = import.meta.env.VITE_SERVER;

export default function useAuthRedirect() {
  const navigate = useNavigate();
  const [userInSession, setUserInSession] = useState(true);

  useEffect(() => {
    async function isInSession() {
      try {
        const res = await fetch(`${SERVER}/getData`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        console.log("Session Check:", data);

        if (data.data === "UNDEFINED") {
          setUserInSession(false);
          navigate("/"); // Redirect to login/home
        }
      } catch (err) {
        console.log("Error in session check:", err);
        setUserInSession(false);
        navigate("/");
      }
    }

    isInSession();
  }, [navigate]);

  return userInSession;
}
