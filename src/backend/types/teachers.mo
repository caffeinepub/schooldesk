import Common "common";

module {
  public type Teacher = {
    id : Common.TeacherId;
    teacherId : Text;
    name : Text;
    subjects : [Text];
    classesAssigned : [Text];
    createdAt : Common.Timestamp;
  };

  public type CreateTeacherInput = {
    teacherId : Text;
    name : Text;
    subjects : [Text];
    classesAssigned : [Text];
  };

  public type UpdateTeacherInput = {
    id : Common.TeacherId;
    teacherId : Text;
    name : Text;
    subjects : [Text];
    classesAssigned : [Text];
  };
};
