import Types "../types/teachers";
import Common "../types/common";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public func createTeacher(
    teachers : Map.Map<Common.TeacherId, Types.Teacher>,
    nextId : Nat,
    input : Types.CreateTeacherInput,
  ) : Types.Teacher {
    let teacher : Types.Teacher = {
      id = nextId;
      teacherId = input.teacherId;
      name = input.name;
      subjects = input.subjects;
      classesAssigned = input.classesAssigned;
      createdAt = Time.now();
    };
    teachers.add(nextId, teacher);
    teacher;
  };

  public func updateTeacher(
    teachers : Map.Map<Common.TeacherId, Types.Teacher>,
    input : Types.UpdateTeacherInput,
  ) : ?Types.Teacher {
    switch (teachers.get(input.id)) {
      case null null;
      case (?existing) {
        let updated : Types.Teacher = {
          existing with
          teacherId = input.teacherId;
          name = input.name;
          subjects = input.subjects;
          classesAssigned = input.classesAssigned;
        };
        teachers.add(input.id, updated);
        ?updated;
      };
    };
  };

  public func deleteTeacher(
    teachers : Map.Map<Common.TeacherId, Types.Teacher>,
    id : Common.TeacherId,
  ) : Bool {
    let existed = teachers.containsKey(id);
    if (existed) { teachers.remove(id) };
    existed;
  };

  public func getTeacher(
    teachers : Map.Map<Common.TeacherId, Types.Teacher>,
    id : Common.TeacherId,
  ) : ?Types.Teacher {
    teachers.get(id);
  };

  public func listTeachers(
    teachers : Map.Map<Common.TeacherId, Types.Teacher>,
  ) : [Types.Teacher] {
    teachers.values().toArray();
  };
};
