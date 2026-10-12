import OQL "mo:caffeineai-oql";
import Common "common";

module {
  public func _toRow(self : Common.LeaveRequestStatus) : OQL.Value =
    #text(
      switch self {
        case (#menunggu) "menunggu";
        case (#disetujui) "disetujui";
        case (#ditolak) "ditolak";
      }
    );
};
