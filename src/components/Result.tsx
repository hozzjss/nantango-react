import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { IQuestionAnswer } from "./LevelDetail";
const QUESTION_NUMBER_PER_LEVEL = Number(
  process.env.REACT_APP_QUESTION_NUMBER as string,
);
const Sentence: React.FC<{
  QA: IQuestionAnswer;
}> = ({ QA }) => {
  return (
    <div className="sentence">
      <div className="word_en">{QA.en}</div>
      <div className="word_sound">{QA.meanings[0]}</div>
      <div className="word_ja">{QA.meanings[1]}</div>
    </div>
  );
};
const ResultPageWrapper = styled.div`
  padding: 5px;
  .success-message,
  #review {
    margin-top: 5px;
  }
`;
export default () => {
  const history = useHistory<{ wrongQAs: IQuestionAnswer[] }>();
  const QAs = history.location.state.wrongQAs;
  const now = new Date();
  return (
    <ResultPageWrapper>
      <div id="namae">
        <h1>Quiz Result</h1>
        <p>{`Date：${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`}</p>
        <p>Score: {`${100 * (QUESTION_NUMBER_PER_LEVEL - QAs.length)}`} </p>
        <br />
        <p>Send the Result to Server</p>
        <form action="http://localhost:5000/save-and-show-result" method="get">
          <p>User  <input name="user" type="text" /></p>
          <input name="score" type="hidden" value={`${100 * (QUESTION_NUMBER_PER_LEVEL - QAs.length)}`} />
          <input type="submit" value="Submit" />
        </form>
        <p><button onClick={window.print}>Print</button></p>
        </div>
      {QAs.length > 0 && (
        <div id="review">
          {QAs.map((QA, index) => (
            <Sentence key={index} QA={QA} />
          ))}
        </div>
      )}
      {QAs.length === 0 && (
        <h3 className="success-message">Congratulations, you are super!</h3>
      )}
    </ResultPageWrapper>
  );
};
