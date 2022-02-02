import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';

const Notfound = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/home');
    }, 6000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // purple x moss 2020
  return (
    <div className='wrapper'>
      <Grid
        container
        alignItems='center'
        direction='column'
        justifyContent='center'
      >
        <Grid
          container
          item
          alignItems='center'
          direction='row'
          justifyContent='center'
        >
          <span className='err'>4</span>
          <i className='far fa-question-circle fa-spin' />
          <span className='err'>4</span>
        </Grid>
        <Grid item xs={12} p={5}>
          <div className='msg'>
            <i>Может быть эта страница переехала?</i>
            <br />
            <i>А может быть она просто в карантине?</i>
            <br />
            <i>А может быть она вообще никогда не существовала??</i>
            <p>
              В любом случае, я перенаправляю тебя на нашу домашнюю страницу
            </p>
            <p
              style={{
                fontSize: '1.6rem',
              }}
            >
              <Link href='/home'>WorldMedExpo</Link>
            </p>
          </div>
        </Grid>
      </Grid>
      <style jsx>
        {`
          .wrapper {
            min-height: 100vh;
            width: 100%;
            background-color: #42a5f5;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -ms-flex-align: center;
            -webkit-align-items: center;
            -webkit-box-align: center;
            align-items: center;
            padding-top: 0
          }

          .err {
            color: #ffffff;
            font-family: "Nunito Sans", sans-serif;
            font-size: 17vh;
            padding: 0px 10px 0px 10px;
          }

          .far {
            font-size: 14vh;
            color: #ffffff;
          }

          .msg {
            text-align: center;
            font-family: "Nunito Sans", sans-serif;
            font-size: 1rem;
          }
        `}
      </style>
    </div>
  );
};

export default Notfound;
