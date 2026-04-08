import Types "../types/students";
import Common "../types/common";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public func createStudent(
    students : Map.Map<Common.StudentId, Types.Student>,
    nextId : Nat,
    input : Types.CreateStudentInput,
  ) : Types.Student {
    let student : Types.Student = {
      id = nextId;
      grNo = input.grNo;
      name = input.name;
      class_ = input.class_;
      section = input.section;
      photoUrl = input.photoUrl;
      parentContact = input.parentContact;
      createdAt = Time.now();
    };
    students.add(nextId, student);
    student;
  };

  public func updateStudent(
    students : Map.Map<Common.StudentId, Types.Student>,
    input : Types.UpdateStudentInput,
  ) : ?Types.Student {
    switch (students.get(input.id)) {
      case null null;
      case (?existing) {
        let updated : Types.Student = {
          existing with
          grNo = input.grNo;
          name = input.name;
          class_ = input.class_;
          section = input.section;
          photoUrl = input.photoUrl;
          parentContact = input.parentContact;
        };
        students.add(input.id, updated);
        ?updated;
      };
    };
  };

  public func deleteStudent(
    students : Map.Map<Common.StudentId, Types.Student>,
    id : Common.StudentId,
  ) : Bool {
    let existed = students.containsKey(id);
    if (existed) { students.remove(id) };
    existed;
  };

  public func getStudent(
    students : Map.Map<Common.StudentId, Types.Student>,
    id : Common.StudentId,
  ) : ?Types.Student {
    students.get(id);
  };

  public func listStudents(
    students : Map.Map<Common.StudentId, Types.Student>,
  ) : [Types.Student] {
    students.values().toArray();
  };
};
