import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import Finance "../types/finance";
import FinanceLib "../lib/finance";

mixin (
  accessControlState : AccessControl.AccessControlState,
  savings : Map.Map<Common.SavingsId, Finance.SavingsTransaction>,
  infaq : Map.Map<Common.InfaqId, Finance.InfaqTransaction>,
  counters : {
    var nextSavingsId : Nat;
    var nextInfaqId : Nat;
  },
) {
  public query func listSavings(studentId : Common.StudentId) : async Finance.SavingsSummary {
    FinanceLib.listSavings(savings, studentId);
  };

  public shared ({ caller }) func addSavings(input : Finance.SavingsInput) : async Finance.SavingsTransaction {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    FinanceLib.addSavings(savings, counters, input);
  };

  public shared ({ caller }) func deleteSavings(id : Common.SavingsId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    FinanceLib.deleteSavings(savings, id);
  };

  public query func listInfaq(studentId : Common.StudentId) : async [Finance.InfaqTransaction] {
    FinanceLib.listInfaq(infaq, studentId);
  };

  public query func getInfaqTotal(studentId : Common.StudentId) : async Nat {
    FinanceLib.getInfaqTotal(infaq, studentId);
  };

  public shared ({ caller }) func addInfaq(input : Finance.InfaqInput) : async Finance.InfaqTransaction {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    FinanceLib.addInfaq(infaq, counters, input);
  };

  public shared ({ caller }) func deleteInfaq(id : Common.InfaqId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: hanya guru yang dapat mengubah data");
    };
    FinanceLib.deleteInfaq(infaq, id);
  };
};
