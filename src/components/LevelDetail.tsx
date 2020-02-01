import _ from "lodash";
import React, { useMemo } from "react";
import ProgressBar from "react-flexible-progressbar";
import "react-flexible-progressbar/dist/progressBar.css";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import { IQuestion, useQuestions, useSetUsedChoices } from "./DataProvider";
// import PieTimer from "./PieTimer";
const QUESTION_NUMBER_PER_LEVEL = Number(
  process.env.REACT_APP_QUESTION_NUMBER as string,
);
const talkify = (window as any).talkify;
const voice = new talkify.Html5Player();
voice.forceLanguage("en");
voice.setRate(1);

const Question: React.FC<{
  question: IQuestion;
  onChoosen: any;
  choices: string[];
}> = props => {
  const { question, onChoosen } = props;

  React.useEffect(() => {
    voice.playText(question.en);
    const handle = setTimeout(() => {
      onChoosen(question, null, 5);
    }, 5000);
    return () => clearTimeout(handle);
  }, [onChoosen, question]);

  const timeOnQuestion = useMemo(() => Date.now(), []);
  const [usedChoices, setUsedChoices] = useSetUsedChoices();
  return (
    <>
      <div id="question">
        <p>{props.question.en}</p>
      </div>
      <div id="choices">
        {props.choices.map((choice, index) => (
          <div
            className="choice"
            style={{ pointerEvents: "auto" }}
            key={choice + index}
            onClick={() => {
              setUsedChoices([...usedChoices, ...props.choices]);
              const now = Date.now();
              const diff = now - timeOnQuestion;
              props.onChoosen(props.question, choice, diff / 1000);
            }}
          >
            {choice}
          </div>
        ))}
      </div>
    </>
  );
};

export type IQuestionAnswer = IQuestion & {
  userAnswer: string;
  userTime: number;
};
const ProgressBarWrapper = styled.div`
  width: 100%;
  position: absolute;
  padding: 0 10px;
  box-sizing: border-box;
  bottom: 10px;
`;

export default () => {
  const params: {
    id?: string | undefined;
  } = useParams();
  const { questions: totalQuestions, choices: totalChoices } = useQuestions(
    Number(params.id),
  );
  const history = useHistory();
  const [currentIndex, setIndex] = React.useState<number>(0);
  const questions = React.useMemo(() => {
    return _.take(_.shuffle(totalQuestions), QUESTION_NUMBER_PER_LEVEL);
  }, [totalQuestions]);

  const choices = React.useMemo(() => {
    if (questions[currentIndex]) {
      const opts = _.take(
        _.shuffle(
          totalChoices.filter(
            choice => choice !== questions[currentIndex].meanings[1], // the 4th position in record
          ),
        ),
        2,
      );
      opts.push(questions[currentIndex].meanings[1]); // the 4th position in record
      return _.shuffle(opts);
    }
    return [];
  }, [totalChoices, currentIndex, questions]);

  const [wrongQAs, setWrongQAs] = React.useState<IQuestionAnswer[]>([]);
  const question = React.useMemo(() => {
    return questions[currentIndex];
  }, [questions, currentIndex]);
  const onChoosen = (currentQuestion: IQuestion, answer: string, userTime: number) => {
    if (currentQuestion.meanings[1] !== answer) {
      // the 4th position in record !== user answer
      setWrongQAs([
        ...wrongQAs,
        {
          ...currentQuestion,
          userTime,
          userAnswer: answer,
        },
      ]);
    }
    setIndex(currentIndex + 1);
  };
  React.useEffect(() => {
    if (currentIndex >= QUESTION_NUMBER_PER_LEVEL) {
      history.push("/result", {
        wrongQAs,
      });
    }
  }, [currentIndex, history, wrongQAs]);
  return (
    <div id="quiz" style={{ display: "block" }}>
      {question && (
        <>
          <Question
            question={question}
            onChoosen={onChoosen}
            choices={choices}
          />
          <ProgressBarWrapper>
            <ProgressBar
              height={10}
              progress={Math.round(
                (currentIndex / QUESTION_NUMBER_PER_LEVEL) * 100,
              )}
              showPercentage={true}
            />
          </ProgressBarWrapper>
        </>
      )}
    </div>
  );
};
