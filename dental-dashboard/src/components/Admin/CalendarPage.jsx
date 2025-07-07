import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Calendar } from 'lucide-react';

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  let dayOfWeek = firstDay.getDay();
  
  for (let i = 0; i < dayOfWeek; i++) week.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}


function getWeekDates(date) {
  const week = [];
  const dayIdx = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - dayIdx);
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    week.push(d);
  }
  return week;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


const statusColors = {
  Completed: 'bg-green-100 text-green-700 border-green-200',
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
  Missed: 'bg-red-100 text-red-700 border-red-200',
  Followup: 'bg-blue-100 text-blue-700 border-blue-200',
};




function getDisplayStatus(appt) {
  const now = new Date();
  const apptDate = new Date(appt.appointmentDate);

  if (apptDate < now && (appt.status === 'Pending' || appt.status === 'In Progress')) {
    return 'Completed';
  }
  return appt.status;
}

export default function CalendarPage() {
  
  const [view, setView] = useState('month'); 
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [modalDate, setModalDate] = useState(null); 

  
  const { incidents, patients } = useAppData();

  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthMatrix = getMonthMatrix(year, month);
  const weekDates = getWeekDates(currentDate);

  
  const prevMonth = () => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };
  const prevWeek = () => {
    setCurrentDate(d => {
      const newDate = new Date(d);
      newDate.setDate(d.getDate() - 7);
      return newDate;
    });
  };
  const nextWeek = () => {
    setCurrentDate(d => {
      const newDate = new Date(d);
      newDate.setDate(d.getDate() + 7);
      return newDate;
    });
  };

  
  function getAppointmentsForDate(date) {
    if (!date) return [];
    return incidents.filter(i => {
      const apptDate = new Date(i.appointmentDate);
      return (
        apptDate.getFullYear() === date.getFullYear() &&
        apptDate.getMonth() === date.getMonth() &&
        apptDate.getDate() === date.getDate()
      );
    });
  }

  
  function DayModal({ date, appointments, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">×</button>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Appointments for {date.toLocaleDateString()}</h3>
          {appointments.length === 0 ? (
            <div className="text-gray-400 text-center py-12">No appointments for this day.</div>
          ) : (
            <div className="space-y-4">
              {appointments
                .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
                .map(appt => {
                  const patient = patients.find(p => p.id === appt.patientId);
                  const displayStatus = getDisplayStatus(appt);
                  return (
                    <div key={appt.id} className="flex flex-col gap-2 p-4 rounded-xl border bg-gray-50 text-gray-800 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-base">{patient?.name || 'Unknown'}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[displayStatus] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{displayStatus}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <div><span className="font-medium">Time:</span> {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div><span className="font-medium">Treatment:</span> {appt.title}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    );
  }

  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2" style={{lineHeight: '1.2'}}>
            Calendar
            <Calendar className="w-8 h-8 text-gray-800 ml-2" />
          </h2>
          <p className="text-gray-600">View and manage all appointments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Week
          </button>
        </div>
      </div>
      
      {view === 'month' && (
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">&lt;</button>
          <span className="font-semibold text-lg">
            {currentDate.toLocaleString('default', { month: 'long' })} {year}
          </span>
          <button onClick={nextMonth} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">&gt;</button>
        </div>
      )}
      
      {view === 'month' && (
        <div className="grid grid-cols-7 gap-2">
          
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center font-semibold text-gray-500 py-2">{day}</div>
          ))}
          
          {monthMatrix.map((week, i) =>
            week.map((date, j) => {
              const appointments = getAppointmentsForDate(date);
              
              const statusCount = appointments.reduce((acc, appt) => {
                const status = getDisplayStatus(appt);
                acc[status] = (acc[status] || 0) + 1;
                return acc;
              }, {});
              
              let summary = '';
              if (appointments.length === 0) {
                summary = 'No appointments';
              } else if (Object.keys(statusCount).length === 1) {
                const status = Object.keys(statusCount)[0];
                summary = `${appointments.length} appointment${appointments.length > 1 ? 's' : ''} ${status.toLowerCase()}`;
              } else {
                summary = Object.entries(statusCount)
                  .map(([status, count]) => `${count} ${status.toLowerCase()}`)
                  .join(', ');
              }
              

              
              let customBg = undefined;
              if (appointments.length === 0) {
                customBg = { backgroundColor: '#F7F7F7' };
              } else if (Object.keys(statusCount).length === 1) {
                const status = Object.keys(statusCount)[0];
                if (status === 'Completed') customBg = { backgroundColor: '#E6F4EA' };
                else if (status === 'Pending') customBg = { backgroundColor: '#FFF9E6' };
              }
              return (
                <div
                  key={i + '-' + j}
                  className={`min-h-[80px] rounded-lg p-2 border flex flex-col justify-between shadow-sm transition-transform duration-150 ${date ? 'cursor-pointer hover:bg-blue-50 hover:scale-[1.01]' : 'opacity-0 pointer-events-none'}`}
                  style={customBg}
                  onClick={() => date && setModalDate(date)}
                >
                  {date && <div className="text-sm font-bold text-gray-700 mb-1">{date.getDate()}</div>}
                  
                  <div className="mt-auto text-xs text-center text-gray-600 font-medium pt-2 pb-1">
                    {date ? summary : ''}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      
      {view === 'week' && (
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevWeek} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">&lt;</button>
          <span className="font-semibold text-lg">
            {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
          </span>
          <button onClick={nextWeek} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">&gt;</button>
        </div>
      )}
      
      {view === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          
          {WEEKDAYS.map((day, idx) => (
            <div key={day} className="text-center font-semibold text-gray-500 py-2">{day}</div>
          ))}
          
          {weekDates.map((date, idx) => {
            const appointments = getAppointmentsForDate(date);
            
            const statusCount = appointments.reduce((acc, appt) => {
              const status = getDisplayStatus(appt);
              acc[status] = (acc[status] || 0) + 1;
              return acc;
            }, {});
            
            let summary = '';
            if (appointments.length === 0) {
              summary = 'No appointments';
            } else if (Object.keys(statusCount).length === 1) {
              const status = Object.keys(statusCount)[0];
              summary = `${appointments.length} appointment${appointments.length > 1 ? 's' : ''} ${status.toLowerCase()}`;
            } else {
              summary = Object.entries(statusCount)
                .map(([status, count]) => `${count} ${status.toLowerCase()}`)
                .join(', ');
            }
            
            let customBg = undefined;
            if (appointments.length === 0) {
              customBg = { backgroundColor: '#F7F7F7' };
            } else if (Object.keys(statusCount).length === 1) {
              const status = Object.keys(statusCount)[0];
              if (status === 'Completed') customBg = { backgroundColor: '#E6F4EA' };
              else if (status === 'Pending') customBg = { backgroundColor: '#FFF9E6' };
            }
            return (
              <div
                key={idx}
                className={`min-h-[80px] rounded-lg p-2 border flex flex-col justify-between shadow-sm transition-transform duration-150 cursor-pointer hover:bg-blue-50 hover:scale-[1.01]`}
                style={customBg}
                onClick={() => setModalDate(date)}
              >
                <div className="text-sm font-bold text-gray-700 mb-1">{date.getDate()}</div>
                
                <div className="mt-auto text-xs text-center text-gray-600 font-medium pt-2 pb-1">
                  {summary}
                </div>
              </div>
            );
          })}
        </div>
      )}

      
      {modalDate && (
        <DayModal
          date={modalDate}
          appointments={getAppointmentsForDate(modalDate)}
          onClose={() => setModalDate(null)}
        />
      )}
    </div>
  );
}