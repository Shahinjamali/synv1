const oilParameter = require("../models/oilParameterModel");
const NodeCache = require("node-cache"); // npm install node-cache
const cache = new NodeCache({ stdTTL: 300 }); // 5-minute TTL

async function computeTrends(labReports, oilType = "neat") {
  const cacheKey = `trends_${labReports.map((r) => r.id).join("_")}_${oilType}`;
  const cachedTrends = cache.get(cacheKey);
  if (cachedTrends) {
    console.log("computeTrends - Returning cached trends:", cacheKey);
    return cachedTrends;
  }

  console.log("computeTrends - Received oilType:", oilType);
  if (!labReports || !labReports.length) {
    console.log("computeTrends - No lab reports provided");
    return {};
  }

  const sortedReports = [...labReports]
    .filter((r) => r.timestamp && !isNaN(new Date(r.timestamp).getTime()))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  console.log(
    "computeTrends - Sorted reports:",
    JSON.stringify(sortedReports, null, 2)
  );

  if (!sortedReports.length) {
    console.log("computeTrends - No valid dated reports");
    return {};
  }

  const paramsDict = {};
  sortedReports.forEach((report) => {
    report.parameters.forEach((param) => {
      if (!paramsDict[param.name]) paramsDict[param.name] = [];
      paramsDict[param.name].push({
        timestamp: report.timestamp,
        value: param.value,
      });
    });
  });
  console.log(
    "computeTrends - Parameters dictionary:",
    JSON.stringify(paramsDict, null, 2)
  );

  const parameterType = (await oilParameter.findOne({ oilType }).lean()) || {};
  const groups = {};
  (parameterType.parameters || []).forEach((param) => {
    if (!groups[param.category]) groups[param.category] = [];
    groups[param.category].push(param.name);
  });
  console.log(
    "computeTrends - Parameter groups from oilParameter:",
    JSON.stringify(groups, null, 2)
  );

  const trends = {};
  const labels = sortedReports.map((r) => new Date(r.timestamp).toISOString());

  Object.keys(groups).forEach((groupName) => {
    const paramNames = groups[groupName];
    const datasets = [];

    paramNames.forEach((name, i) => {
      if (paramsDict[name]) {
        const data = labels.map((label) => {
          const entry = paramsDict[name].find((e) => e.timestamp === label);
          return entry ? entry.value : null;
        });

        datasets.push({
          label: `${name} (${
            sortedReports[0]?.parameters.find((p) => p.name === name)?.unit ||
            ""
          })`,
          data,
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
          ][i % 3],
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ][i % 3],
          fill: false,
          tension: 0.1,
        });
      }
    });

    if (datasets.length > 0) {
      trends[groupName] = {
        labels: sortedReports.map((r) =>
          new Date(r.timestamp).toLocaleString()
        ),
        datasets,
      };
    }
  });

  console.log(
    "computeTrends - Computed trends:",
    JSON.stringify(trends, null, 2)
  );
  cache.set(cacheKey, trends);
  return trends;
}

module.exports = { computeTrends };
