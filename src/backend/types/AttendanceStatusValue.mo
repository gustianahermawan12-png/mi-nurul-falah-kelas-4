import OQL "mo:caffeineai-oql";
import Common "common";

module {
  public func _toRow(self : Common.AttendanceStatus) : OQL.Value =
    #text(
      switch self {
        case (#hadir) "hadir";
        case (#sakit) "sakit";
        case (#izin) "izin";
        case (#alpa) "alpa";
      }
    );
};
