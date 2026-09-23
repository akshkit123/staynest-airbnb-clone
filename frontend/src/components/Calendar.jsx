import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({
  checkIn,
  checkOut,
  onSelectDate,
  bookedRanges = [],
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isBooked = (dateStr) => {
    const target = new Date(dateStr).getTime();
    return bookedRanges.some((range) => {
      const start = new Date(range.check_in).getTime();
      const end = new Date(range.check_out).getTime();
      return target >= start && target <= end;
    });
  };

  const isPast = (dateStr) => {
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return target < today;
  };

  const isSelected = (dateStr) => {
    return dateStr === checkIn || dateStr === checkOut;
  };

  const isInRange = (dateStr) => {
    if (!checkIn || !checkOut) return false;
    const target = new Date(dateStr).getTime();
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    return target > start && target < end;
  };

  return (
    <div className="calendar-widget">
      {/* Month Header */}
      <div className="calendar-header">
        <button onClick={prevMonth} className="calendar-nav-btn">
          <ChevronLeft size={18} />
        </button>
        <span className="calendar-month-title">
          {monthNames[month]} {year}
        </span>
        <button onClick={nextMonth} className="calendar-nav-btn">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="calendar-weekdays">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className="calendar-weekday">
            {d}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="calendar-days-grid">
        {[...Array(firstDayIndex)].map((_, i) => (
          <div key={`empty-${i}`} className="calendar-empty-cell" />
        ))}

        {[...Array(daysInMonth)].map((_, i) => {
          const dayNum = i + 1;
          const formattedMonth = String(month + 1).padStart(2, '0');
          const formattedDay = String(dayNum).padStart(2, '0');
          const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

          const booked = isBooked(dateStr);
          const past = isPast(dateStr);
          const disabled = booked || past;
          const selected = isSelected(dateStr);
          const inRange = isInRange(dateStr);

          return (
            <button
              key={dateStr}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(dateStr)}
              className={`calendar-day-btn ${
                disabled ? 'disabled' : ''
              } ${selected ? 'selected' : ''} ${inRange ? 'in-range' : ''}`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      <style>{`
        .calendar-widget {
          padding: 16px;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          background: #FFFFFF;
          max-width: 340px;
        }
        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .calendar-month-title {
          font-weight: 700;
          font-size: 1rem;
        }
        .calendar-nav-btn {
          padding: 6px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          transition: var(--transition);
        }
        .calendar-nav-btn:hover {
          background-color: var(--bg-secondary);
        }
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .calendar-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .calendar-empty-cell {
          aspect-ratio: 1;
        }
        .calendar-day-btn {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.88rem;
          font-weight: 500;
          border-radius: 50%;
          transition: var(--transition);
          color: var(--text-main);
        }
        .calendar-day-btn:hover:not(.disabled) {
          border: 1px solid var(--text-main);
        }
        .calendar-day-btn.disabled {
          color: #D1D5DB;
          text-decoration: line-through;
          cursor: not-allowed;
        }
        .calendar-day-btn.selected {
          background-color: var(--text-main);
          color: #FFFFFF;
          font-weight: 700;
        }
        .calendar-day-btn.in-range {
          background-color: var(--bg-secondary);
          border-radius: 0;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
