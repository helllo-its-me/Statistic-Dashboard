import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useState, useEffect } from 'react'

const StatisticsCart = ({ data, date }) => {
  const [result, setResult] = useState([])

  useEffect(() => {
    setResult(
      Object.values(
        data.reduce((a, { impressions, budget, date }) => {
          if (!a[date])
            a[date] = Object.assign(
              {},
              { impressions, budget: Number(budget), date }
            )
          else {
            a[date].budget += Number(budget)
            let b = a[date].budget
            a[date].budget = Number(b.toFixed(2))
            a[date].impressions += impressions
          }
          return a
        }, {})
      )
    )
  }, [data])

  //CHECK
  // if (
  //   data.reduce((a, b) => a + Number(b.budget), 0).toLocaleString() !==
  //   result.reduce((a, b) => a + Number(b.budget), 0).toLocaleString()
  // ) {
  //   console.log(
  //     'WARNING БЮДЖЕТ GRAFIK',
  //     data.reduce((a, b) => a + Number(b.budget), 0).toLocaleString(),
  //     result.reduce((a, b) => a + Number(b.budget), 0).toLocaleString()
  //   )
  // }
  // if (
  //   data.reduce((a, b) => a + b.impressions, 0).toLocaleString() !==
  //   result.reduce((a, b) => a + b.impressions, 0).toLocaleString()
  // ) {
  //   console.log(
  //     'WARNING ПОКАЗЫ GRAFIK',
  //     data.reduce((a, b) => a + b.impressions, 0).toLocaleString(),
  //     result.reduce((a, b) => a + b.impressions, 0).toLocaleString()
  //   )
  // }
  //End Check

  return (
    <ResponsiveContainer width='100%' height={400}>
      <LineChart
        width={500}
        height={300}
        data={date?.[0] === date?.[1] ? data : result}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type='monotone'
          dataKey='budget'
          stroke='#8884d8'
          activeDot={{ r: 8 }}
        />
        <Line type='monotone' dataKey='impressions' stroke='#82ca9d' />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default StatisticsCart
