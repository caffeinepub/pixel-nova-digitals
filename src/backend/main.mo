import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Branding = {
    tagLine : Text;
    brandName : Text;
    heroBadge : Text;
    logoFile : ?Text;
  };

  public type HomePageContent = {
    heroTitle : Text;
    heroSubtitle : Text;
    freeSection : Text;
    premiumSection : Text;
    branding : Branding;
  };

  var homePageContent = {
    heroTitle = "Generative Magic, Super Easy!";
    heroSubtitle = "Generate text, audio, image and video through AI - for free.";
    freeSection = "Free access for all - no email required";
    premiumSection = "Premium subscription with full features";
    branding = {
      tagLine = "Effortless AI for all";
      brandName = "Magic Genie AI";
      heroBadge = "ABHISHEK YADAV PRESENT";
      logoFile = ?"genie-logo-darker.png";
    };
  };

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

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userGenHistory = Map.empty<Principal, Map.Map<Nat, GenRecord>>();
  var nextRecordId = 0;

  // Homepage content management
  public shared ({ caller }) func updateHomepageContent(content : HomePageContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update homepage content");
    };
    homePageContent := content;
  };

  public query ({ caller }) func getHomepageContent() : async HomePageContent {
    homePageContent;
  };

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

  public shared ({ caller }) func updateGenRecord(recordId : Nat, newType : GenType, newPrompt : Text, newMetadata : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update generation records");
    };

    switch (userGenHistory.get(caller)) {
      case (null) {
        Runtime.trap("No record found for user");
      };
      case (?recordMap) {
        switch (recordMap.get(recordId)) {
          case (null) {
            Runtime.trap("Record does not exist");
          };
          case (?_) {
            let updatedRecord : GenRecord = {
              type_ = newType;
              prompt = newPrompt;
              createdAt = recordId.toInt();
              metadata = newMetadata;
            };
            recordMap.add(recordId, updatedRecord);
          };
        };
      };
    };
  };
};
