import OQL "mo:caffeineai-oql";
import Common "common";

module {
  public func _toRow(self : Common.SavingsDirection) : OQL.Value =
    #text(
      switch self {
        case (#masuk) "masuk";
        case (#keluar) "keluar";
      }
    );
};
