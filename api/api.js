import axios from 'axios';
import { parseCookies } from 'nookies';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = parseCookies().token;

export default axios.create({
  baseURL:  process.env.NEXT_PUBLIC_API+"/",
  withCredentials: true,
});

 