import Common "common";

module {
  public type UserProfile = Common.UserProfile;
  public type Role = Common.Role;

  public type SessionInfo = {
    username : Text;
    role : Common.Role;
    roleId : Text;
    name : Text;
    createdAt : Common.Timestamp;
  };

  public type AddUserInput = {
    username : Text;
    password : Text;
    roleId : Text;
    name : Text;
  };

  public type LoginResult = {
    #ok : Text; // session token
    #err : Text;
  };

  public type AddUserResult = {
    #ok : Common.UserProfile;
    #err : Text;
  };
};
