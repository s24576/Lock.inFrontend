import axios from "axios";
import { usePathname } from "next/navigation";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const useAxiosPublic = () => {
  const pathname = usePathname();

  const langRegex = /^\/([a-z]{2})\//;
  const langMatch = pathname.match(langRegex);
  const language = langMatch ? langMatch[1] : "en";

  const axiosInstance = axios.create({
    baseURL,
    headers: { "Accept-Language": language },
  });

  return axiosInstance;
};

export default useAxiosPublic;
