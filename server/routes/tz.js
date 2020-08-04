function trimDate(date, offset) {
  const baseDate = new Date(date);
  baseDate.setMinutes(baseDate.getMinutes() + offset);

  if (baseDate.getUTCHours() < 5) {
    baseDate.setUTCDate(baseDate.getUTCDate() - 1);
  }

  baseDate.setUTCHours(0);
  baseDate.setUTCMinutes(0);
  baseDate.setUTCSeconds(0);
  baseDate.setUTCMilliseconds(0);

  return baseDate;
}

function getDateDiff(hour, offset, refDate) {
  return hour === null ? 0 : (refDate - trimDate(hour, offset)) / 86400000;
}

module.exports = { trimDate, getDateDiff };
