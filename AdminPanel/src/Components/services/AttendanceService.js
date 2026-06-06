export const getAttendanceStats = (records) => {
  let present = 0;
  let absent = 0;
  let leave = 0;

  records.forEach((r) => {
    if (r.status === "present") present++;
    else if (r.status === "absent") absent++;
    else if (r.status === "leave") leave++;
  });

  return { present, absent, leave };
};