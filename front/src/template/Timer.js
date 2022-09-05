import React, { useState, useEffect } from 'react';

const Timer = ({ active, onCheckTime }) => {
  //3분 고정이 아닐 경우 Props로 전달
  const [min, setMin] = useState(3);
  const [sec, setSec] = useState(0);

  useEffect(() => {
    let timer;
    //clearInterval(timer);
    if (active) {
      timer = setInterval(() => {
        if (Number(sec) > 0) {
          setSec(Number(sec) - 1);
        }
        if (Number(sec) === 0) {
          if (Number(min) === 0) {
            clearInterval(timer);
            onCheckTime();
          } else {
            setMin(Number(min) - 1);
            setSec(59);
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [min, sec, active]);

  return (
    <span style={{marginLeft:'10px'}}>
      {min}:{sec < 10 ? `0${sec}` : sec}
    </span>
  );
};

export default Timer;