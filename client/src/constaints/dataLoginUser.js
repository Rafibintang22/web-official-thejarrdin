import { create } from "zustand";
const userSession = JSON.parse(localStorage.getItem("userSession"));

const useDataUser = create(() => ({
  headers: {
    headers: {
      authorization: userSession?.AuthKey,
    },
  },
  dataUser: userSession?.dataUser,
  userSession: userSession,
}));

export default useDataUser;
