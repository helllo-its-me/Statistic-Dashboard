import 'rsuite/dist/rsuite.min.css'
import { DateRangePicker, CustomProvider } from 'rsuite'
import ru_RU from 'rsuite/locales/ru_RU'
import './Datepicker.css'

const Datepicker = ({ value, setValue }) => {
  const { before } = DateRangePicker
  return (
    <div
      className='dataPicker-container'
      style={{ width: '20%', textAlign: 'left' }}>
      <p style={{ margin: '0', fontSize: '14px' }}>Период</p>
      <CustomProvider locale={ru_RU}>
        <DateRangePicker
          format='dd.MM.yyyy'
          value={value}
          onChange={setValue}
          disabledDate={before('2021-11-23')}
        />
      </CustomProvider>
    </div>
  )
}

export default Datepicker
