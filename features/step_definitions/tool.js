function dataTableToUInt8Array(dataTable) {
  return dataTable.rawTable[0].map((n) => parseInt(n));
}

module.exports = { dataTableToUInt8Array };
