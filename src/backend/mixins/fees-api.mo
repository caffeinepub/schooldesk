import FeeTypes "../types/fees";
import Common "../types/common";
import AuthTypes "../types/auth";
import FeesLib "../lib/fees";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

mixin (
  fees : Map.Map<Common.FeeId, FeeTypes.FeeRecord>,
  sessions : Map.Map<Text, AuthTypes.SessionInfo>,
) {
  var nextFeeId : Nat = 1;

  func requireAdminFees(token : Text) {
    switch (sessions.get(token)) {
      case (?s) {
        if (s.role != #Admin) Runtime.trap("Unauthorized: Admin access required");
      };
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
  };

  public shared func createFeeRecord(token : Text, input : FeeTypes.CreateFeeInput) : async FeeTypes.FeeRecord {
    requireAdminFees(token);
    let record = FeesLib.createFeeRecord(fees, nextFeeId, input);
    nextFeeId += 1;
    record;
  };

  public shared func updateFeeRecord(token : Text, input : FeeTypes.UpdateFeeInput) : async ?FeeTypes.FeeRecord {
    requireAdminFees(token);
    FeesLib.updateFeeRecord(fees, input);
  };

  public shared func markFeePaid(token : Text, id : Common.FeeId, paidDate : Common.Timestamp) : async ?FeeTypes.FeeRecord {
    requireAdminFees(token);
    FeesLib.markFeePaid(fees, id, paidDate);
  };

  public query func listFeesByStudent(studentId : Common.StudentId) : async [FeeTypes.FeeRecord] {
    FeesLib.listFeesByStudent(fees, studentId);
  };

  public query func listAllFees() : async [FeeTypes.FeeRecord] {
    FeesLib.listAllFees(fees);
  };
};
