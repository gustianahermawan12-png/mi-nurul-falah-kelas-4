import OQL "mo:caffeineai-oql";
import Common "common";

module {
  public func _toRow(self : Common.Semester) : OQL.Value =
    #text(
      switch self {
        case (#semester1) "semester1";
        case (#semester2) "semester2";
      }
    );
};
