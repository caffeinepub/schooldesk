import Common "../types/common";
import AuthTypes "../types/auth";
import AuthLib "../lib/auth";
import Map "mo:core/Map";

mixin (
  credentials : Map.Map<Text, Text>,
  userProfiles : Map.Map<Text, Common.UserProfile>,
  sessions : Map.Map<Text, AuthTypes.SessionInfo>,
) {
  // Seed admin on startup
  AuthLib.seedAdmin(credentials, userProfiles);

  public shared func login(username : Text, password : Text) : async AuthTypes.LoginResult {
    AuthLib.login(credentials, userProfiles, sessions, username, password);
  };

  public query func validateSession(token : Text) : async ?Common.UserProfile {
    AuthLib.validateSession(sessions, token);
  };

  public shared func logout(token : Text) : async () {
    AuthLib.logout(sessions, token);
  };

  public shared func addUser(token : Text, input : AuthTypes.AddUserInput) : async AuthTypes.AddUserResult {
    AuthLib.addUser(sessions, credentials, userProfiles, token, input);
  };
};
