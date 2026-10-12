import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Common "../types/common";
import Finance "../types/finance";

module {
  public func listSavings(savings : Map.Map<Common.SavingsId, Finance.SavingsTransaction>, studentId : Common.StudentId) : Finance.SavingsSummary {
    let transactions = savings.values().toArray().filter(func s = s.studentId == studentId);
    let totalIn = transactions.filter(func t = t.direction == #masuk).foldLeft(0, func(acc, t) = acc + t.amount);
    let totalOut = transactions.filter(func t = t.direction == #keluar).foldLeft(0, func(acc, t) = acc + t.amount);
    {
      totalIn;
      totalOut;
      balance = if (totalIn >= totalOut) { totalIn - totalOut } else { 0 };
      transactions;
    };
  };

  public func addSavings(savings : Map.Map<Common.SavingsId, Finance.SavingsTransaction>, counters : { var nextSavingsId : Nat }, input : Finance.SavingsInput) : Finance.SavingsTransaction {
    let id = counters.nextSavingsId;
    counters.nextSavingsId += 1;
    let entry : Finance.SavingsTransaction = {
      id;
      studentId = input.studentId;
      direction = input.direction;
      amount = input.amount;
      date = input.date;
      note = input.note;
    };
    savings.add(id, entry);
    entry;
  };

  public func deleteSavings(savings : Map.Map<Common.SavingsId, Finance.SavingsTransaction>, id : Common.SavingsId) : () {
    savings.remove(id);
  };

  public func listInfaq(infaq : Map.Map<Common.InfaqId, Finance.InfaqTransaction>, studentId : Common.StudentId) : [Finance.InfaqTransaction] {
    infaq.values().toArray().filter(func i = i.studentId == studentId);
  };

  public func getInfaqTotal(infaq : Map.Map<Common.InfaqId, Finance.InfaqTransaction>, studentId : Common.StudentId) : Nat {
    listInfaq(infaq, studentId).foldLeft(0, func(acc, i) = acc + i.amount);
  };

  public func addInfaq(infaq : Map.Map<Common.InfaqId, Finance.InfaqTransaction>, counters : { var nextInfaqId : Nat }, input : Finance.InfaqInput) : Finance.InfaqTransaction {
    let id = counters.nextInfaqId;
    counters.nextInfaqId += 1;
    let entry : Finance.InfaqTransaction = {
      id;
      studentId = input.studentId;
      amount = input.amount;
      date = input.date;
      note = input.note;
    };
    infaq.add(id, entry);
    entry;
  };

  public func deleteInfaq(infaq : Map.Map<Common.InfaqId, Finance.InfaqTransaction>, id : Common.InfaqId) : () {
    infaq.remove(id);
  };
};
