import { useEffect, useState } from "react";
import { loadGoogleMapsApi } from "@/services/maps";

export function useGoogleMaps() {
  const [state, setState] = useState({
    google: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    loadGoogleMapsApi()
      .then((google) => {
        if (mounted) {
          setState({
            google,
            loading: false,
            error: null
          });
        }
      })
      .catch((error) => {
        if (mounted) {
          setState({
            google: null,
            loading: false,
            error
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
