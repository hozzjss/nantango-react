import axios from "axios";
import _ from "lodash";
import React, { useState } from "react";
export const DataContext = React.createContext<{
  isLoading: boolean;
  quesDict: {
    [key: number]: IQuestion[];
  };
  usedChoices: string[];
  setUsedChoices: any;
}>({
  isLoading: true,
  quesDict: {},
  usedChoices: [],
  // tslint:disable-next-line:no-empty
  setUsedChoices: () => {},
});

// tslint:disable-next-line:no-var-requires
const csvString = require("csv-string");

export interface IQuestion {
  level: number;
  en: string;
  meanings: string[];
}

export const useSetUsedChoices = () => {
  const context = React.useContext(DataContext);
  return [context.usedChoices, context.setUsedChoices];
};

const serializeCsvData = (
  rows: Array<[number, string, string, string, string]>,
) => {
  const quesDict: {
    [key: number]: IQuestion[];
  } = {};

  rows.forEach(row => {
    if (!quesDict[row[0]]) {
      quesDict[row[0]] = [];
    }
    quesDict[row[0]].push({
      level: row[0],
      en: row[1].trim(),
      meanings: [row[2].trim(), row[3].trim(), row[4].trim()],
    });
  });
  return quesDict;
};

export const useLevels = () => {
  const data = React.useContext(DataContext);
  return Object.keys(data.quesDict);
};

export const useQuestions = (level: number) => {
  const data = React.useContext(DataContext);

  const questions = data.quesDict[level];
  const choices = questions.map(question => question.meanings[1]); // the 4th position in record
  const usedChocies = data.usedChoices;
  const unUsedChoices = _.xor(choices, usedChocies);

  if (unUsedChoices.length <= 3) {
    data.setUsedChoices([]);
    return {
      questions,
      choices,
    };
  }
  return {
    questions,
    choices: unUsedChoices,
  };
};
const DataProvider: React.FC = props => {
  const [isLoading, setisLoading] = useState<boolean>(true);
  const [usedChoices, setUsedChoices] = useState<string[]>([]);
  const [quesDict, setDict] = useState<{
    [key: number]: IQuestion[];
  }>([]);

  const getData = async () => {
    const res = await axios.get(process.env.REACT_APP_DATA_LINK as any);
    if (res.status === 200) {
      const csvBody = res.request.responseText;
      const dict = serializeCsvData(csvString.parse(csvBody));
      setDict(dict);
    }
  };

  React.useEffect(() => {
    (async () => {
      await getData();
      setisLoading(false);
    })();
  }, []);
  return (
    <DataContext.Provider
      value={{ isLoading, quesDict, usedChoices, setUsedChoices }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
export default DataProvider;
