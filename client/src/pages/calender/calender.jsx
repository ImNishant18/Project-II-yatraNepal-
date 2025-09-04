import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './calender.css'; // Assuming you have a CSS file for styling
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

const api = axios.create({
  baseURL: 'http://localhost:8800/api',
});

const NepaliCalendar = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [today, setToday] = useState(null);
  const [events, setEvents] = useState([]);

  const months = [
    { value: '1', name: 'Baisakh (April–May)' },
    { value: '2', name: 'Jestha (May–June)' },
    { value: '3', name: 'Ashar (June–July)' },
    { value: '4', name: 'Shrawan (July–August)' },
    { value: '5', name: 'Bhadra (August–September)' },
    { value: '6', name: 'Ashoj (September–October)' },
    { value: '7', name: 'Kartik (October–November)' },
    { value: '8', name: 'Mangsir (November–December)' },
    { value: '9', name: 'Poush (December–January)' },
    { value: '10', name: 'Magh (January–February)' },
    { value: '11', name: 'Falgun (February–March)' },
    { value: '12', name: 'Chaitra (March–April)' },
  ];

  const englishDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const years = Array.from({ length: 4 }, (_, i) => (2080 + i).toString());

  useEffect(() => {
    const initializeCalendar = async () => {
      try {
        setLoading(true);
        const todayResponse = await api.get('/calendar/today');
        const todayData = todayResponse.data?.data;

        if (todayData) {
          setToday(todayData);
          setYear(todayData.year.toString());
          setMonth(todayData.month.toString());
        }
      } catch (err) {
        console.error('Error fetching today date:', err.message);
        setYear('2082');
        setMonth('4');
      } finally {
        setLoading(false);
      }
    };

    initializeCalendar();
  }, []);

  useEffect(() => {
    const fetchMonthData = async () => {
      if (!year || !month) return;

      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/${year}/${month}`);
        const data = Array.isArray(response.data) ? response.data : [];

        const firstDay = data[0]?.day || 'Sunday';
        const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const startIndex = dayOrder.indexOf(firstDay);

        const paddedData = [...Array(startIndex).fill(null), ...data];
        setCalendarData(paddedData);

        const monthEvents = data.filter(day => day?.event && day.event.trim() !== '');
        setEvents(monthEvents);
      } catch (err) {
        console.error('Error fetching month data:', err.message);
        setError('Failed to load calendar data. Please try again.');
        setCalendarData([]);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthData();
  }, [year, month]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const navigateMonth = (direction) => {
    let newMonth = parseInt(month);
    let newYear = parseInt(year);

    if (direction === 'prev') {
      newMonth -= 1;
      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }
    } else {
      newMonth += 1;
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }
    }

    setYear(newYear.toString());
    setMonth(newMonth.toString());
  };

  const isToday = (day) => {
    if (!today || !day) return false;
    return (
      day.np === today.np &&
      parseInt(month) === today.month &&
      parseInt(year) === today.year
    );
  };

  const isHoliday = (day) => {
    return day?.isholiday;
  };

  const renderCalendar = () => {
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!calendarData || calendarData.length === 0) return <div className="error">No calendar data available</div>;

    const weeks = [];
    for (let i = 0; i < calendarData.length; i += 7) {
      weeks.push(calendarData.slice(i, i + 7));
    }

    return (
      <table className="calendar-grid">
        <thead>
          <tr>
            {englishDays.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  className={`
                    day-cell
                    ${!day ? 'empty' : ''}
                    ${day && isToday(day) ? 'today' : ''}
                    ${day && isHoliday(day) ? 'holiday' : ''}
                  `}
                >
                  {day ? (
                    <>
                      <div className="day-number">{day.np}</div>
                      <div className="english-date">{day.en}</div>
                    </>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderEvents = () => {
    if (events.length === 0) return null;

    return (
      <div className="events-container">
        <h3>Events this month:</h3>
        <ul className="events-list">
          {events.map((event, index) => (
            <li key={index}>
              <span className="event-date">{event.np_date}:</span> {event.event}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const currentMonthName = months.find(m => m.value === month)?.name || '';
  const currentYear = year;

  return (
    <>
      <Navbar />
      <Header />
      <div className="nepali-calendar">
        <div className="calendar-header">
          <h1>Nepali Calendar</h1>
          <div className="controls">
            <div className="navigation">
              <button onClick={() => navigateMonth('prev')}>&lt; Previous</button>
              <div className="month-year-display">
                {currentMonthName} {currentYear}
              </div>
              <button onClick={() => navigateMonth('next')}>
                Next &gt;
              </button>
            </div>

            <div className="dropdowns">
              <select value={year} onChange={handleYearChange}>
                {years.map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select value={month} onChange={handleMonthChange}>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {renderCalendar()}

        {renderEvents()}

        <div className="calendar-footer">
          <div className="legend">
            <div className="legend-item">
              <span className="today-marker"></span> Today
            </div>
            <div className="legend-item">
              <span className="holiday-marker"></span> Holiday
            </div>
          </div>
          {today && (
            <div className="today-info">
              Today: {today.np_date}
              <span className="english-today"> ({today.en_date})</span>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>

  );
};

export default NepaliCalendar;
