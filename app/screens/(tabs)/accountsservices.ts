import axios from "axios";

const URL = "https://jsonplaceholder.typicode.com/users";
const URL_POST = "https://jsonplaceholder.typicode.com/posts";

export const fetchAccounts = async () => {
  const res = await axios.get(URL);
  return res.data;
};

// JSONPlaceholder does not actually persist POST,
// but we simulate creation
export const createAccounts = async (user: any) => {
  const res = await axios.post(URL, user);
  return res.data;
};
