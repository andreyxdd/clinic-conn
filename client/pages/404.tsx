import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import useLayout from '../customHooks/useLayout';
import useRedirect from '../customHooks/useRedirect';

export async function getStaticProps() {
  return {
    props: {},
  };
}

// eslint-disable-next-line no-unused-vars
const Notfound: NextPage = (props) => {
  useLayout();
  useRedirect({ after: 6, where: '/home', whom: 'all' });

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
            position: relative;
            width: 100vw;
            left: 50%;
            right: 50%;
            margin-left: -50vw;
            margin-right: -50vw;
            height: 100vh;
            margin-top: -100px;
            margin-bottom: -100px;
            background-color: #42a5f5;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -ms-flex-align: center;
            -webkit-align-items: center;
            -webkit-box-align: center;
            align-items: center;
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
