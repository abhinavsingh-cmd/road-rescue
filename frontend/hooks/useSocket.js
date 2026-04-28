import { useEffect, useState } from "react";
import { getSocket } from "@/services/socket";

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const instance = getSocket();
    setSocket(instance);

    return () => {
      instance?.off();
    };
  }, []);

  return socket;
}
