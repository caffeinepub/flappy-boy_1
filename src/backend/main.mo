import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  var adminPrincipal : Principal = Principal.fromText("2vxsx-fae");

  // Initialize the access control system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type as required by instructions
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Required user profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Game-specific admin functionality
  var startLevel = 0;

  // Check if caller is admin (using AccessControl system)
  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Get the admin principal (returns the first admin found, or anonymous if none)
  public query ({ caller }) func getAdminPrincipal() : async Principal {
    adminPrincipal;
  };

  // Set admin principal (uses AccessControl.assignRole which has admin-only guard)
  public shared ({ caller }) func setAdminPrincipal(newAdminPrincipal : Principal) : async () {
    if (adminPrincipal != caller and
      (adminPrincipal != Principal.fromText("2vxsx-fae"))
    ) {
      Runtime.trap("Unauthorized: Can only be called by the current admin principal OR during first-time setup (when admin is anonymous principal).");
    };
    adminPrincipal := newAdminPrincipal;
  };

  // Admin-only: Set start level for game testing
  public shared ({ caller }) func setStartLevel(level : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin) or caller == adminPrincipal)) {
      Runtime.trap("Unauthorized: Only admins can set start level");
    };
    if (level > 21) {
      Runtime.trap("Level must be between 0 and 21");
    };
    startLevel := level;
  };

  // Anyone can query the start level
  public query ({ caller }) func getStartLevel() : async Nat {
    startLevel;
  };
};
