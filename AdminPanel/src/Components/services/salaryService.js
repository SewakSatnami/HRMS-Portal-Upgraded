export const calculateSalary = (baseSalary, present, absent, leave) => {
  const totalDays = 30;

  const perDay = baseSalary / totalDays;

  const absentDeduction = absent * perDay;

  const paidLeaves = 2;
  const unpaidLeaves = Math.max(leave - paidLeaves, 0);

  const leaveDeduction = unpaidLeaves * perDay;

  const finalSalary =
    baseSalary - absentDeduction - leaveDeduction;

  return {
    finalSalary,
    absentDeduction,
    leaveDeduction,
  };
};