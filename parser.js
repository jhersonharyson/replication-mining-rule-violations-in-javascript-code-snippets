const fs = require("fs");

const report_dir = "./javascript_code/reports";
const rules_dir = ".";

let getReports = () => {
  const reports = [];
  fileNames = fs.readdirSync(report_dir);
  fileNames.forEach((filename) => {
    if (filename.endsWith(".json")) {
      let rawdata = fs.readFileSync(`${report_dir}/${filename}`);
      reports.push(JSON.parse(rawdata));
    }
  });
  return reports;
};

const getRules = () => {
  let rawdata = fs.readFileSync(`${rules_dir}/rules.json`);
  return JSON.parse(rawdata);
};

const aggregateRules = () => {
  const rules = getRules();
  const reports = getReports();

  const aggregate = rules
    .map(({ classification }) => ({
      [classification]: 0,
    }))
    .reduce((a, b) => Object.assign(a, b), {});

  aggregate["Parsing error"] = 0;

  const getListOfViolationsFromFileReport = (report) =>
    report.messages.map(({ ruleId }) => {
      return rules
        .filter((classification) => {
          return classification.rules.map(({ rule }) => rule).includes(ruleId);
        })
        .map(({ classification }) => classification);
    });

  const counters = [];
  reports.forEach((reportJsonFile) => {
    reportJsonFile.forEach((reportUnit) => {
      counters.push(...getListOfViolationsFromFileReport(reportUnit));
    });
  });

  counters.forEach(
    (violation) =>
      (aggregate[violation != "" ? violation : "Parsing error"] += 1)
  );
  console.log(aggregate);
  fs.writeFileSync("results/aggregate.json", JSON.stringify(aggregate))
};

const mostCommonViolationPerCategory = () => {
  const rules = getRules();
  const reports = getReports();

  const mostCommom = rules
    .map(({ classification, rules }) => ({
      [classification]: rules
        .map(({ rule }) => ({ [rule]: 0 }))
        .reduce((a, b) => Object.assign(a, b), {}),
    }))
    .reduce((a, b) => Object.assign(a, b), {});

  mostCommom["Parsing error"] = 0;

  const getListOfViolationsFromFileReport = (report) =>
    report.messages.map(({ ruleId }) => {
      return rules.map((classification) => {
        if (classification.rules.map(({ rule }) => rule).includes(ruleId)) {
          mostCommom[classification.classification][ruleId]++;
        }
      });
    });

  reports.forEach((reportJsonFile) => {
    reportJsonFile.forEach((reportUnit) => {
      getListOfViolationsFromFileReport(reportUnit);
    });
  });

  const commons = Object.keys(mostCommom).map((key) => {
    const mostCommomRule = Object.keys(mostCommom[key])
      .sort((a, b) => mostCommom[key][a] - mostCommom[key][b])
      .pop();
    return {
      [key]: { [mostCommomRule]: mostCommom[key][mostCommomRule] },
    };
  });
  console.log(commons);
  fs.writeFileSync("results/commons.json", JSON.stringify(commons))
  return commons;
};

const violationsDistribuition = () => {
  const rules = getRules();
  const reports = getReports();

  const distribuition = [];

  const getListOfViolationsFromFileReport = (report) => {
    let violationCounter = 0;
    report.messages.map(({ ruleId }) => {
      return rules.map((classification) => {
        if (classification.rules.map(({ rule }) => rule).includes(ruleId)) {
          violationCounter++;
        }
      });
    });
    distribuition.push(violationCounter);
  };

  reports.forEach((reportJsonFile) => {
    reportJsonFile.forEach((reportUnit) => {
      getListOfViolationsFromFileReport(reportUnit);
    });
  });

  console.log(distribuition);
  fs.writeFileSync("results/distribuition.json", JSON.stringify(distribuition))
  return distribuition;
};

const postsWithPossibleErrors = () => {
  const rules = getRules();
  const reports = getReports();
  const possibleErrorsRules = rules
    .filter(({ classification }) => classification == "Possible Errors")
    .pop();
  let errors = new Set();

  const getListOfViolationsFromFileReport = (report) => {
    return report.messages
      .filter(({ ruleId }) =>
        possibleErrorsRules.rules.some(({ rule }) => rule.includes(ruleId))
      )
      .map((_) => ({
        postId: report.filePath.split("\\").pop().replace(".js", ""),
      }));
  };

  reports.forEach((reportJsonFile) => {
    reportJsonFile.forEach((reportUnit) => {
      const posts = getListOfViolationsFromFileReport(reportUnit);
      if (!!posts.length) errors.add(...posts);
    });
  });

  console.log(errors);
  console.log("Total: " + errors.size);
  fs.writeFileSync("results/errors.json", JSON.stringify(errors))
  fs.writeFileSync("results/total.txt", "Errors size: "+errors.size)
  return errors;
};

aggregateRules();
mostCommonViolationPerCategory();
violationsDistribuition();
postsWithPossibleErrors();
