import { useState, useEffect } from 'react'
import Select from 'react-select'
import Button from 'rsuite/Button'
import Datepicker from './Components/Datepicker/Datepicker'
import Table from './Components/Table/Table'
import StatisticsChart from './Components/StatisticsChart'
import { StatisticsWiget } from './Components/StatisticsWiget'

import './App.css'

function App() {
  const [value, setValue] = useState()
  const [selectedOptions, setSelectedOptions] = useState([])
  const [data, setData] = useState([])

  const [dataForTable, setDataForTable] = useState([])
  const [dateForChart, setDateForChart] = useState()

  const trasformData = (data) =>
    data
      .map((el) => {
        return {
          ...el,
          date: el.date[0] && new Date(el.date).toISOString().split('T')[0],
          type: el.type === 0 ? 'Баннер' : 'Видео',
          budget: Number(el.budget.toFixed(2)),
        }
      })
      .sort((a, b) => (a.date > b.date ? 1 : -1))
  useEffect(() => {
    setDataForTable(trasformData(data))

    // CHECK
    // if (
    //   data.reduce((a, b) => a + Number(b.budget), 0).toLocaleString() !==
    //   dataForTable.reduce((a, b) => a + Number(b.budget), 0).toLocaleString()
    // ) {
    //   console.log(
    //     'WARNING БЮДЖЕТ',
    //     data.reduce((a, b) => a + Number(b.budget), 0).toLocaleString(),
    //     dataForTable.reduce((a, b) => a + Number(b.budget), 0).toLocaleString()
    //   )
    // }
    // if (
    //   data.reduce((a, b) => a + b.impressions, 0).toLocaleString() !==
    //   dataForTable.reduce((a, b) => a + b.impressions, 0).toLocaleString()
    // ) {
    //   console.log(
    //     'WARNING ПОКАЗЫ',
    //     data.reduce((a, b) => a + b.impressions, 0).toLocaleString(),
    //     dataForTable.reduce((a, b) => a + b.impressions, 0).toLocaleString()
    //   )
    // }
    // end check
  }, [data])
  // useEffect(() => {
  //   setData([])
  // }, [value])

  async function getData(e) {
    setDateForChart(value)
    let startDate = value && value[0] ? getDate(value[0]) : ''
    let endDate = value && value[1] ? getDate(value[1]) : ''

    e.preventDefault()

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/api/stats',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            startDate:
              new Date(startDate).toISOString().split('T')[0] + 'T00:00:00Z',
            endDate:
              new Date(endDate).toISOString().split('T')[0] + 'T23:59:59Z',
          }),
        }
      )
      const json = await response.json()
      setData(json)
    } catch (error) {
      console.log(error)
    }
  }
  const getBudget = (data) =>
    data.reduce((a, b) => a + Number(b.budget), 0).toLocaleString()

  const getImpressions = (data) =>
    data.reduce((a, b) => a + b.impressions, 0).toLocaleString()

  const getDate = (date) => {
    if (date) {
      let newDate = new Date(date)

      return new Date(
        newDate.getTime() - newDate.getTimezoneOffset() * 60000
      ).toISOString()
    }
  }

  return (
    <div className='App'>
      <header className='header'></header>
      <div className='content' style={{ paddingBottom: '20px' }}>
        <div className='container container-for-datapicker'>
          <Datepicker value={value} setValue={setValue} />
        </div>
        <div className='container container-for-select'>
          <div className='statistic' style={{ width: '60%' }}>
            <StatisticsChart
              data={dataForTable}
              date={
                dateForChart && [
                  getDate(dateForChart[0]),
                  getDate(dateForChart[1]),
                ]
              }
            />
          </div>
          <div className='select' style={{ width: '30%' }}>
            <Select
              closeMenuOnSelect={false}
              isMulti
              options={[
                { value: 'date', label: 'Дата', id: 1 },
                { value: 'type', label: 'Тип', id: 2 },
                { value: 'siteId', label: 'Placement', id: 3 },
              ]}
              onChange={setSelectedOptions}
              value={selectedOptions}
            />
            <StatisticsWiget
              date={
                dateForChart && [
                  getDate(dateForChart[0]),
                  getDate(dateForChart[1]),
                ]
              }
              impressions={getImpressions(dataForTable)}
              budget={getBudget(dataForTable)}
            />
          </div>
        </div>
        <div className='container-for-sendbutton'>
          <Button color='yellow' appearance='primary' onClick={getData}>
            Применить
          </Button>
        </div>
        <hr />
        <Table
          data={dataForTable}
          selectedOptions={selectedOptions.sort((a, b) =>
            a.id > b.id ? 1 : -1
          )}
        />
      </div>
    </div>
  )
}

export default App
