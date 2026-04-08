import NoticeTypes "../types/notices";
import Common "../types/common";
import AuthTypes "../types/auth";
import NoticesLib "../lib/notices";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

mixin (
  notices : Map.Map<Common.NoticeId, NoticeTypes.Notice>,
  sessions : Map.Map<Text, AuthTypes.SessionInfo>,
) {
  var nextNoticeId : Nat = 1;

  func assertCanWrite(token : Text) {
    switch (sessions.get(token)) {
      case (?s) {
        switch (s.role) {
          case (#Admin or #Teacher) {};
          case (#Student) Runtime.trap("Unauthorized: Students cannot create or delete notices");
        };
      };
      case null Runtime.trap("Unauthorized: invalid or expired session");
    };
  };

  func callerName(token : Text) : Text {
    switch (sessions.get(token)) {
      case (?s) s.name;
      case null "Unknown";
    };
  };

  public shared func createNotice(token : Text, input : NoticeTypes.CreateNoticeInput) : async NoticeTypes.Notice {
    assertCanWrite(token);
    let inputWithCaller : NoticeTypes.CreateNoticeInput = { input with createdBy = callerName(token) };
    let notice = NoticesLib.createNotice(notices, nextNoticeId, inputWithCaller);
    nextNoticeId += 1;
    notice;
  };

  public query func listNotices(audience : ?NoticeTypes.Audience, classId : ?Text) : async [NoticeTypes.Notice] {
    NoticesLib.listNotices(notices, audience, classId);
  };

  public shared func deleteNotice(token : Text, id : Common.NoticeId) : async Bool {
    assertCanWrite(token);
    NoticesLib.deleteNotice(notices, id);
  };
};
