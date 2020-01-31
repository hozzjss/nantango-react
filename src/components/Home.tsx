import React from "react";

import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useLevels } from "./DataProvider";
const LevelWrapper = styled.div`
  cursor: pointer;
`;
const Level: React.FC<{ label: string; id: string }> = props => {
  const history = useHistory();
  const onLevelClick = () => {
    history.push(`/level-detail/${props.id}`);
  };
  return (
    <LevelWrapper className="level" onClick={onLevelClick}>
      {props.label}
    </LevelWrapper>
  );
};

export default () => {
  const levels = useLevels();
  return (
    <>
      <div id="start">なんたんご</div>
      {levels.map(level => (
        <Level label={`Lv${level}`} id={level} key={level} />
      ))}
    </>
  );
};
