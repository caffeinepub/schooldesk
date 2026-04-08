import Common "common";

module {
  public type Homework = {
    id : Common.HomeworkId;
    title : Text;
    description : Text;
    classId : Text;
    dueDate : Common.Timestamp;
    createdBy : Text;
    createdAt : Common.Timestamp;
  };

  public type SubmissionStatus = {
    #Submitted;
    #Pending;
  };

  public type HomeworkSubmission = {
    homeworkId : Common.HomeworkId;
    studentId : Common.StudentId;
    submittedAt : Common.Timestamp;
    status : SubmissionStatus;
  };

  public type CreateHomeworkInput = {
    title : Text;
    description : Text;
    classId : Text;
    dueDate : Common.Timestamp;
    createdBy : Text;
  };
};
