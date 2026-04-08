import Common "common";

module {
  public type Audience = {
    #All;
    #Admin;
    #Teacher;
    #Student;
    #Class;
  };

  public type Notice = {
    id : Common.NoticeId;
    title : Text;
    content : Text;
    audience : Audience;
    classId : ?Text;
    createdAt : Common.Timestamp;
    createdBy : Text;
  };

  public type CreateNoticeInput = {
    title : Text;
    content : Text;
    audience : Audience;
    classId : ?Text;
    createdBy : Text;
  };
};
