import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";

module {
  type Branding = {
    tagLine : Text;
    brandName : Text;
    heroBadge : Text;
    logoFile : ?Text;
  };

  type HomePageContent = {
    heroTitle : Text;
    heroSubtitle : Text;
    freeSection : Text;
    premiumSection : Text;
    branding : Branding;
  };

  type GenType = {
    #text;
    #image;
    #sound;
    #video;
  };

  type GenRecord = {
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

  type UserProfile = {
    name : Text;
  };

  type WebsiteState = {
    #active;
    #retired : { message : ?Text };
  };

  type OldActor = {
    homePageContent : HomePageContent;
    userProfiles : Map.Map<Principal, UserProfile>;
    userGenHistory : Map.Map<Principal, Map.Map<Nat, GenRecord>>;
    nextRecordId : Nat;
  };

  type NewActor = {
    homePageContent : HomePageContent;
    userProfiles : Map.Map<Principal, UserProfile>;
    userGenHistory : Map.Map<Principal, Map.Map<Nat, GenRecord>>;
    nextRecordId : Nat;
    websiteState : WebsiteState;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      websiteState = #active
    };
  };
};
