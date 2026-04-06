const nextId = async (prefix, Model, fieldName, width = 3) => {
  const regex = new RegExp(`^${prefix}(\\d{${width}})$`);
  const latest = await Model.findOne({ [fieldName]: regex }).sort({ [fieldName]: -1 }).select(fieldName).lean();

  if (!latest || !latest[fieldName]) {
    return `${prefix}${String(1).padStart(width, '0')}`;
  }

  const match = latest[fieldName].match(regex);
  const currentNumber = match ? parseInt(match[1], 10) : 0;
  const nextNumber = currentNumber + 1;
  return `${prefix}${String(nextNumber).padStart(width, '0')}`;
};

module.exports = { nextId };