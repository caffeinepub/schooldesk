import Types "../types/marks";
import Common "../types/common";
import Map "mo:core/Map";
import Int "mo:core/Int";

module {
  public func addMark(
    marks : Map.Map<Common.MarkId, Types.Mark>,
    nextId : Nat,
    input : Types.AddMarkInput,
  ) : Types.Mark {
    let mark : Types.Mark = {
      id = nextId;
      studentId = input.studentId;
      subject = input.subject;
      assessmentName = input.assessmentName;
      score = input.score;
      maxScore = input.maxScore;
      date = input.date;
    };
    marks.add(nextId, mark);
    mark;
  };

  public func updateMark(
    marks : Map.Map<Common.MarkId, Types.Mark>,
    input : Types.UpdateMarkInput,
  ) : ?Types.Mark {
    switch (marks.get(input.id)) {
      case null null;
      case (?existing) {
        let updated : Types.Mark = {
          existing with
          score = input.score;
          maxScore = input.maxScore;
          assessmentName = input.assessmentName;
        };
        marks.add(input.id, updated);
        ?updated;
      };
    };
  };

  public func getMarksByStudent(
    marks : Map.Map<Common.MarkId, Types.Mark>,
    studentId : Common.StudentId,
  ) : [Types.Mark] {
    marks.values()
      .filter(func(m : Types.Mark) : Bool = m.studentId == studentId)
      .sort(func(a : Types.Mark, b : Types.Mark) : { #equal; #greater; #less } { Int.compare(b.date, a.date) })
      .toArray();
  };

  public func getMarksBySubject(
    marks : Map.Map<Common.MarkId, Types.Mark>,
    subject : Text,
  ) : [Types.Mark] {
    marks.values()
      .filter(func(m : Types.Mark) : Bool = m.subject == subject)
      .toArray();
  };
};
