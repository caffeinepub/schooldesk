import Common "common";

module {
  public type FeeStatus = {
    #Paid;
    #Unpaid;
    #Late;
  };

  public type FeeRecord = {
    id : Common.FeeId;
    studentId : Common.StudentId;
    amount : Nat;
    dueDate : Common.Timestamp;
    paidDate : ?Common.Timestamp;
    status : FeeStatus;
    receiptNumber : Text;
    lateFeeAmount : Nat;
  };

  public type CreateFeeInput = {
    studentId : Common.StudentId;
    amount : Nat;
    dueDate : Common.Timestamp;
    receiptNumber : Text;
    lateFeeAmount : Nat;
  };

  public type UpdateFeeInput = {
    id : Common.FeeId;
    amount : Nat;
    dueDate : Common.Timestamp;
    receiptNumber : Text;
    lateFeeAmount : Nat;
    status : FeeStatus;
  };
};
