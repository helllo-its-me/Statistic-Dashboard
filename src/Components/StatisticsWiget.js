import { Panel } from 'rsuite'

export const StatisticsWiget = ({ date = '', budget, impressions }) => {
  let startDate = date[0]
    ? new Date(date[0]).toISOString().split('T')[0]
    : '____'
  let endDate = date[1] ? new Date(date[1]).toISOString().split('T')[0] : '____'

  return (
    <Panel header={`Статистика за период c ${startDate} по ${endDate}`} shaded>
      <p>Бюджет: {budget}</p>
      <p>Показы: {impressions}</p>
    </Panel>
  )
}
