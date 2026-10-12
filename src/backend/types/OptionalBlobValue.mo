import OQL "mo:caffeineai-oql";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public func _toRow(self : ?Storage.ExternalBlob) : OQL.Value =
    switch self {
      case (?blob) #text (blob.decodeUtf8() ?? "");
      case null #null_;
    };
};
