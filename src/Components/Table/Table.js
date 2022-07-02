import { useState } from 'react'
import { Table } from 'rsuite'

const TableComponent = ({ data, selectedOptions }) => {
  const [sortColumn, setSortColumn] = useState()
  const [sortType, setSortType] = useState()
  const [loading, setLoading] = useState(false)

  const reduceData = (data, ...dataKeys) =>
    Object.values(
      data.reduce((a, { siteId, type, impressions, budget, date }) => {
        const ib = (key) => {
          return {
            impressions: a[key]
              ? a[key].impressions + impressions
              : impressions,
            budget: Number(
              (a[key] ? a[key].budget + budget : budget).toFixed(2)
            ),
          }
        }
        switch (dataKeys.length) {
          case 0:
            a['empty'] = { ...ib('empty') }
            break
          case 1:
            if (dataKeys.includes('date')) a[date] = { date, ...ib(date) }
            if (dataKeys.includes('type')) a[type] = { type, ...ib(type) }
            if (dataKeys.includes('siteId'))
              a[siteId] = { siteId, ...ib(siteId) }
            break
          case 2:
            if (dataKeys.includes('date') && dataKeys.includes('type'))
              a[date + type] = { date, type, ...ib(date + type) }
            if (dataKeys.includes('date') && dataKeys.includes('siteId'))
              a[date + siteId] = { date, siteId, ...ib(date + siteId) }
            if (dataKeys.includes('siteId') && dataKeys.includes('type'))
              a[siteId + type] = { siteId, type, ...ib(siteId + type) }
            break
          case 3:
            return data
          default:
            break
        }
        return a
      }, {})
    )

  let selected = selectedOptions.map((el) => el.value)
  let superFinal = reduceData(data, ...selected)

  // CHECK
  // if (
  //   data.reduce((a, b) => a + Number(b.budget), 0).toLocaleString() !==
  //   superFinal.reduce((a, b) => a + Number(b.budget), 0).toLocaleString()
  // ) {
  //   console.log(
  //     'WARNING БЮДЖЕТ TABLE',
  //     data.reduce((a, b) => a + Number(b.budget), 0).toLocaleString(),
  //     superFinal.reduce((a, b) => a + Number(b.budget), 0).toLocaleString()
  //   )
  // }
  // if (
  //   data.reduce((a, b) => a + b.impressions, 0).toLocaleString() !==
  //   superFinal.reduce((a, b) => a + b.impressions, 0).toLocaleString()
  // ) {
  //   console.log(
  //     'WARNING ПОКАЗЫ TABLE',
  //     data.reduce((a, b) => a + b.impressions, 0).toLocaleString(),
  //     superFinal.reduce((a, b) => a + b.impressions, 0).toLocaleString()
  //   )
  // }
  // end CHECK

  const getData = () => {
    if (sortColumn && sortType) {
      return superFinal.sort((a, b) => {
        let x = a[sortColumn]
        let y = b[sortColumn]
        if (typeof x === 'string') {
          x = x.charCodeAt()
        }
        if (typeof y === 'string') {
          y = y.charCodeAt()
        }
        if (sortType === 'asc') {
          return x - y
        } else {
          return y - x
        }
      })
    }
    return superFinal
  }

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSortColumn(sortColumn)
      setSortType(sortType)
    }, 500)
  }

  return (
    <Table
      height={420}
      data={getData()}
      sortColumn={sortColumn}
      sortType={sortType}
      onSortColumn={handleSortColumn}
      loading={loading}>
      {selectedOptions.map((el, i) => (
        <Table.Column key={i} minWidth={150} flexGrow={2} sortable>
          <Table.HeaderCell>{el.label}</Table.HeaderCell>
          <Table.Cell dataKey={el.value} />
        </Table.Column>
      ))}
      <Table.Column minWidth={130} flexGrow={2} align='center' sortable>
        <Table.HeaderCell>Показы</Table.HeaderCell>
        <Table.Cell dataKey='impressions' />
      </Table.Column>

      <Table.Column minWidth={130} flexGrow={2} sortable>
        <Table.HeaderCell>Бюджет</Table.HeaderCell>
        <Table.Cell dataKey='budget' />
      </Table.Column>
    </Table>
  )
}

export default TableComponent
