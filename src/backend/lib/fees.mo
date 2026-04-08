import Types "../types/fees";
import Common "../types/common";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  // Apply late fee logic: if current time > dueDate and status is Unpaid, return Late
  func resolveStatus(record : Types.FeeRecord) : Types.FeeRecord {
    switch (record.status) {
      case (#Unpaid) {
        if (Time.now() > record.dueDate) {
          { record with status = #Late };
        } else {
          record;
        };
      };
      case (_) record;
    };
  };

  public func createFeeRecord(
    fees : Map.Map<Common.FeeId, Types.FeeRecord>,
    nextId : Nat,
    input : Types.CreateFeeInput,
  ) : Types.FeeRecord {
    let receiptNumber = "RCP-" # nextId.toText();
    let record : Types.FeeRecord = {
      id = nextId;
      studentId = input.studentId;
      amount = input.amount;
      dueDate = input.dueDate;
      paidDate = null;
      status = #Unpaid;
      receiptNumber = receiptNumber;
      lateFeeAmount = input.lateFeeAmount;
    };
    fees.add(nextId, record);
    resolveStatus(record);
  };

  public func updateFeeRecord(
    fees : Map.Map<Common.FeeId, Types.FeeRecord>,
    input : Types.UpdateFeeInput,
  ) : ?Types.FeeRecord {
    switch (fees.get(input.id)) {
      case null null;
      case (?existing) {
        let updated : Types.FeeRecord = {
          existing with
          amount = input.amount;
          dueDate = input.dueDate;
          receiptNumber = input.receiptNumber;
          lateFeeAmount = input.lateFeeAmount;
          status = input.status;
        };
        fees.add(input.id, updated);
        ?(resolveStatus(updated));
      };
    };
  };

  public func markFeePaid(
    fees : Map.Map<Common.FeeId, Types.FeeRecord>,
    id : Common.FeeId,
    paidDate : Common.Timestamp,
  ) : ?Types.FeeRecord {
    switch (fees.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.FeeRecord = {
          existing with
          status = #Paid;
          paidDate = ?paidDate;
        };
        fees.add(id, updated);
        ?updated;
      };
    };
  };

  public func listFeesByStudent(
    fees : Map.Map<Common.FeeId, Types.FeeRecord>,
    studentId : Common.StudentId,
  ) : [Types.FeeRecord] {
    fees.values()
      .filter(func(r : Types.FeeRecord) : Bool { r.studentId == studentId })
      .map(resolveStatus)
      .toArray();
  };

  public func listAllFees(
    fees : Map.Map<Common.FeeId, Types.FeeRecord>,
  ) : [Types.FeeRecord] {
    fees.values()
      .map(resolveStatus)
      .toArray();
  };
};
