import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

actor {
  type Item = {
    id: Nat;
    name: Text;
    icon: ?Text;
  };

  stable var nextItemId: Nat = 0;
  let itemMap = HashMap.HashMap<Nat, Item>(10, Nat.equal, Nat.hash);

  public shared(msg) func addItem(name: Text, icon: ?Text) : async Result.Result<Nat, Text> {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    let id = nextItemId;
    nextItemId += 1;

    let newItem: Item = {
      id = id;
      name = name;
      icon = icon;
    };

    itemMap.put(id, newItem);
    #ok(id)
  };

  public shared(msg) func removeItem(id: Nat) : async Result.Result<(), Text> {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return #err("Authentication required");
    };

    switch (itemMap.remove(id)) {
      case null { #err("Item not found") };
      case (?_) { #ok(()) };
    }
  };

  public query func getItems() : async [Item] {
    Array.map<(Nat, Item), Item>(Iter.toArray(itemMap.entries()), func (_, item) { item })
  };

  system func preupgrade() {
    // No need to implement as we're using a stable variable for nextItemId
    // and itemMap is already using a stable HashMap
  };

  system func postupgrade() {
    // No need to implement as we're using a stable variable for nextItemId
    // and itemMap is already using a stable HashMap
  };
}
