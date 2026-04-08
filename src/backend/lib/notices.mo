import Types "../types/notices";
import Common "../types/common";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  public func createNotice(
    notices : Map.Map<Common.NoticeId, Types.Notice>,
    nextId : Nat,
    input : Types.CreateNoticeInput,
  ) : Types.Notice {
    let notice : Types.Notice = {
      id = nextId;
      title = input.title;
      content = input.content;
      audience = input.audience;
      classId = input.classId;
      createdAt = Time.now();
      createdBy = input.createdBy;
    };
    notices.add(nextId, notice);
    notice;
  };

  func matchesFilter(n : Types.Notice, audience : ?Types.Audience, classId : ?Text) : Bool {
    switch (audience) {
      case null true;
      case (?#All) n.audience == #All;
      case (?#Admin) {
        switch (n.audience) { case (#All or #Admin) true; case _ false };
      };
      case (?#Teacher) {
        switch (n.audience) { case (#All or #Teacher) true; case _ false };
      };
      case (?#Student) {
        switch (n.audience) {
          case (#All or #Student) true;
          case (#Class) {
            switch (classId, n.classId) {
              case (?cid, ?nCid) cid == nCid;
              case _ false;
            };
          };
          case _ false;
        };
      };
      case (?#Class) {
        switch (classId, n.classId) {
          case (?cid, ?nCid) {
            let audienceOk = switch (n.audience) { case (#All or #Class) true; case _ false };
            audienceOk and cid == nCid;
          };
          case _ n.audience == #All;
        };
      };
    };
  };

  public func listNotices(
    notices : Map.Map<Common.NoticeId, Types.Notice>,
    audience : ?Types.Audience,
    classId : ?Text,
  ) : [Types.Notice] {
    notices.entries()
      .filterMap(func((_, n) : (Common.NoticeId, Types.Notice)) : ?Types.Notice {
        if (matchesFilter(n, audience, classId)) ?n else null
      })
      .toArray();
  };

  public func deleteNotice(
    notices : Map.Map<Common.NoticeId, Types.Notice>,
    id : Common.NoticeId,
  ) : Bool {
    switch (notices.get(id)) {
      case null false;
      case (?_) {
        notices.remove(id);
        true;
      };
    };
  };
};
