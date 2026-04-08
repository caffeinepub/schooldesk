import Types "../types/auth";
import Common "../types/common";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";

module {
  // Detect role from roleId prefix
  public func detectRole(roleId : Text) : Common.Role {
    if (roleId.startsWith(#text "ADM")) {
      #Admin;
    } else if (roleId.startsWith(#text "TCH")) {
      #Teacher;
    } else {
      #Student;
    };
  };

  // Simple token generation: username + timestamp as text
  public func generateToken(username : Text, now : Int) : Text {
    username # "-" # now.toText();
  };

  // Seed admin user if not already present
  public func seedAdmin(
    credentials : Map.Map<Text, Text>,
    userProfiles : Map.Map<Text, Common.UserProfile>,
  ) {
    if (credentials.get("admin") == null) {
      credentials.add("admin", "admin123");
      let profile : Common.UserProfile = {
        id = "admin";
        username = "admin";
        name = "Administrator";
        role = #Admin;
        roleId = "ADM001";
        createdAt = Time.now();
      };
      userProfiles.add("admin", profile);
    };
  };

  // Login: validate credentials, create session, return token
  public func login(
    credentials : Map.Map<Text, Text>,
    userProfiles : Map.Map<Text, Common.UserProfile>,
    sessions : Map.Map<Text, Types.SessionInfo>,
    username : Text,
    password : Text,
  ) : Types.LoginResult {
    switch (credentials.get(username)) {
      case null { #err("Invalid username or password") };
      case (?storedPass) {
        if (storedPass != password) {
          #err("Invalid username or password");
        } else {
          let profile = switch (userProfiles.get(username)) {
            case (?p) p;
            case null { return #err("User profile not found") };
          };
          let token = generateToken(username, Time.now());
          let session : Types.SessionInfo = {
            username = profile.username;
            role = profile.role;
            roleId = profile.roleId;
            name = profile.name;
            createdAt = profile.createdAt;
          };
          sessions.add(token, session);
          #ok(token);
        };
      };
    };
  };

  // Validate session token, return UserProfile if valid
  public func validateSession(
    sessions : Map.Map<Text, Types.SessionInfo>,
    token : Text,
  ) : ?Common.UserProfile {
    switch (sessions.get(token)) {
      case null null;
      case (?s) {
        ?{
          id = s.username;
          username = s.username;
          name = s.name;
          role = s.role;
          roleId = s.roleId;
          createdAt = s.createdAt;
        };
      };
    };
  };

  // Logout: remove session
  public func logout(
    sessions : Map.Map<Text, Types.SessionInfo>,
    token : Text,
  ) {
    sessions.remove(token);
  };

  // Add user (admin only)
  public func addUser(
    sessions : Map.Map<Text, Types.SessionInfo>,
    credentials : Map.Map<Text, Text>,
    userProfiles : Map.Map<Text, Common.UserProfile>,
    adminToken : Text,
    input : Types.AddUserInput,
  ) : Types.AddUserResult {
    // Validate caller is admin
    switch (sessions.get(adminToken)) {
      case null { #err("Invalid or expired session") };
      case (?s) {
        if (s.role != #Admin) {
          return #err("Unauthorized: Admin only");
        };
        // Check duplicate
        if (credentials.get(input.username) != null) {
          return #err("Username already exists");
        };
        credentials.add(input.username, input.password);
        let profile : Common.UserProfile = {
          id = input.username;
          username = input.username;
          name = input.name;
          role = detectRole(input.roleId);
          roleId = input.roleId;
          createdAt = Time.now();
        };
        userProfiles.add(input.username, profile);
        #ok(profile);
      };
    };
  };

  // Get role from session token (for other mixins)
  public func getRoleFromToken(
    sessions : Map.Map<Text, Types.SessionInfo>,
    token : Text,
  ) : ?Common.Role {
    switch (sessions.get(token)) {
      case null null;
      case (?s) ?(s.role);
    };
  };

  // Get session info
  public func getSessionInfo(
    sessions : Map.Map<Text, Types.SessionInfo>,
    token : Text,
  ) : ?Types.SessionInfo {
    sessions.get(token);
  };
};
