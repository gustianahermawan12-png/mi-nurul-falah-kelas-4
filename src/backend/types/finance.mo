import Common "common";

module {
  public type SavingsTransaction = {
    id : Common.SavingsId;
    studentId : Common.StudentId;
    direction : Common.SavingsDirection;
    amount : Nat;
    date : Text;
    note : Text;
  };

  public type SavingsSummary = {
    totalIn : Nat;
    totalOut : Nat;
    balance : Nat;
    transactions : [SavingsTransaction];
  };

  public type InfaqTransaction = {
    id : Common.InfaqId;
    studentId : Common.StudentId;
    amount : Nat;
    date : Text;
    note : Text;
  };

  public type SavingsInput = {
    studentId : Common.StudentId;
    direction : Common.SavingsDirection;
    amount : Nat;
    date : Text;
    note : Text;
  };

  public type InfaqInput = {
    studentId : Common.StudentId;
    amount : Nat;
    date : Text;
    note : Text;
  };
};
