import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type GenType = {
    #text;
    #image;
    #sound;
    #video;
  };

  public type GenRecord = {
    type_ : GenType;
    prompt : Text;
    createdAt : Int;
    metadata : Text;
  };

  type GenRecordWithId = (Nat, GenRecord);
  module GenRecordWithId {
    func compare(left : GenRecordWithId, right : GenRecordWithId) : Order.Order {
      Nat.compare(left.0, right.0);
    };
  };

  public type GenRecordEntry = {
    recordId : Nat;
    type_ : GenType;
    prompt : Text;
    createdAt : Int;
    metadata : Text;
  };

  func toEntry(tup : GenRecordWithId) : GenRecordEntry {
    let (id, record) = tup;
    {
      recordId = id;
      type_ = record.type_;
      prompt = record.prompt;
      createdAt = record.createdAt;
      metadata = record.metadata;
    };
  };

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userGenHistory = Map.empty<Principal, Map.Map<Nat, GenRecord>>();
  var nextRecordId = 0;

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  // Generation history management functions
  public shared ({ caller }) func addGenRecord(type_ : GenType, prompt : Text, metadata : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add generation records");
    };

    let recordId = nextRecordId;
    nextRecordId += 1;
    let newRecord : GenRecord = {
      type_;
      prompt;
      createdAt = recordId.toInt();
      metadata;
    };

    switch (userGenHistory.get(caller)) {
      case (null) {
        let newMap = Map.empty<Nat, GenRecord>();
        newMap.add(recordId, newRecord);
        userGenHistory.add(caller, newMap);
      };
      case (?existingMap) {
        existingMap.add(recordId, newRecord);
      };
    };

    recordId;
  };

  public query ({ caller }) func getGenHistory() : async [GenRecordEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view generation history");
    };

    switch (userGenHistory.get(caller)) {
      case (null) { [] };
      case (?recordMap) {
        recordMap.entries().map(toEntry).toArray();
      };
    };
  };

  public shared ({ caller }) func deleteGenRecord(recordId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete generation records");
    };

    switch (userGenHistory.get(caller)) {
      case (null) { Runtime.trap("Record does not exist") };
      case (?recordMap) {
        if (not recordMap.containsKey(recordId)) {
          Runtime.trap("Record does not exist");
        };
        recordMap.remove(recordId);
        true;
      };
    };
  };
};
