import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function LineGraph({ analytics, timeframe }) {

  const year1 = [
    'Current Price',
    '1 Month',
    '2 Months',
    '3 Months',
    '4 Months',
    '5 Months',
    '6 Months',
    '7 Months',
    '8 Months',
    '9 Months',
    '10 Months',
    '11 Months',
    '12 Months',
  ];

  const years4 = [
    'Current Price',
    '6 months',
    '1 year',
    '1.5 years',
    '2 years',
    '2.5 years',
    '3 years',
    '3.5 years',
    '4 years',
  ]

  const years10 = [
    'Current Price',
    '1 year',
    '2 years',
    '3 years',
    '4 years',
    '5 years',
    '6 years',
    '7 years',
    '8 years',
    '9 years',
    '10 years'
  ]
  const timeframeHeaders = (timeframe) => {
    timeframe = parseInt(timeframe)
    if (timeframe === 1) {
      return year1
    } else if (timeframe === 4) {
      return years4
    } else if (timeframe === 10) {
      return years10
    }
  }

  const analyticsByTimeframe = (timeframe, analytics) => {
    timeframe = parseInt(timeframe)
    if (timeframe === 1) {
      return analytics
    }
    // if timeframe = 4, take every 6th month
    else if (timeframe === 4) {
      return analytics.filter((price, index) => index % 6 === 0)
    }
    // if timeframe = 10, take every 12th month
    else if (timeframe === 10) {
      return analytics.filter((price, index) => index % 12 === 0)
    }
  }


  function round2dp(price) {
    return Math.round(price * 100) / 100
  }



  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timeframeHeaders(timeframe),
        datasets: [
          {
            label: 'Price',
            data: analyticsByTimeframe(timeframe, analytics),
            borderColor: 'blue',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price'
            }
          }
        }
      }
    });
  }, [analytics]);

  return (
    <div class="wrapper">
      <canvas ref={canvasRef} className="line--graph"></canvas>
    </div>
  );
}

export default LineGraph;
