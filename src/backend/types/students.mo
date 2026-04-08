import Common "common";

module {
  public type Student = {
    id : Common.StudentId;
    grNo : Text;
    name : Text;
    class_ : Text;
    section : Text;
    photoUrl : Text;
    parentContact : Text;
    createdAt : Common.Timestamp;
  };

  public type CreateStudentInput = {
    grNo : Text;
    name : Text;
    class_ : Text;
    section : Text;
    photoUrl : Text;
    parentContact : Text;
  };

  public type UpdateStudentInput = {
    id : Common.StudentId;
    grNo : Text;
    name : Text;
    class_ : Text;
    section : Text;
    photoUrl : Text;
    parentContact : Text;
  };
};
