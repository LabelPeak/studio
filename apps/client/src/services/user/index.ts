import { User } from "@/interfaces/user";
import { requestWithAuth } from "../request";

function getProfile() {
  return requestWithAuth<User>("/api/user");
}

const UserService = {
  getProfile
};

export default UserService;