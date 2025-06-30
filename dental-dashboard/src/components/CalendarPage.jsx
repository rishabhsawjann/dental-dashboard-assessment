import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { UserRound, CalendarClock, Hourglass, CheckCircle2, DollarSign } from 'lucide-react';

// Helper: Get a matrix of weeks for the current month
function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  let dayOfWeek = firstDay.getDay();
  // Fill initial empty days
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

// Helper: Get the dates for the current week (Sunday-Saturday)
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

// Status color mapping
const statusColors = {
  Completed: 'bg-green-100 text-green-700 border-green-200',
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
  Missed: 'bg-red-100 text-red-700 border-red-200',
  Followup: 'bg-blue-100 text-blue-700 border-blue-200',
};

// Helper: Get an icon for a treatment title
function getTreatmentIcon(title = '') {
  const t = title.toLowerCase();
  if (t.includes('dental cleaning')) return '🧼';
  if (t.includes('tooth extraction')) return '🦷';
  if (t.includes('cavity filling')) return '🪥';
  if (t.includes('root canal')) return '🔧';
  if (t.includes('teeth whitening')) return '✨';
  if (t.includes('braces consultation')) return '😬';
  if (t.includes('x-ray')) return '📷';
  if (t.includes('scaling & polishing')) return '🪣';
  if (t.includes('pain relief')) return '💊';
  if (t.includes('checkup')) return '🩺';
  if (t.includes('crowns & bridges')) return '👑';
  if (t.includes('veneers')) return '🦷';
  if (t.includes('implants')) return '🦾';
  if (t.includes('other')) return '✏️';
  return '🦷';
}

export default function CalendarPage() {
  // State for view mode (month/week), current date, and modal
  const [view, setView] = useState('month'); // 'month' or 'week'
  const [currentDate, setCurrentDate] = useState(new Date()); // The date being viewed
  const [modalDate, setModalDate] = useState(null); // The date for which the modal is open

  // Get appointments and patients from context
  const { incidents, patients } = useAppData();

  // Get year and month for the current view
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthMatrix = getMonthMatrix(year, month);
  const weekDates = getWeekDates(currentDate);

  // Navigation handlers
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

  // Helper: Get appointments for a given date
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

  // Day details modal
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
                  return (
                    <div key={appt.id} className={`flex items-center gap-4 p-4 rounded-xl border ${statusColors[appt.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <span className="text-xl">{getTreatmentIcon(appt.title)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800">{patient?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-600">{appt.title}</div>
                        <div className="text-xs text-gray-500">{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[appt.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{appt.status}</span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // UI
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Calendar</h2>
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
      {/* Month navigation */}
      {view === 'month' && (
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">&lt;</button>
          <span className="font-semibold text-lg">
            {currentDate.toLocaleString('default', { month: 'long' })} {year}
          </span>
          <button onClick={nextMonth} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">&gt;</button>
        </div>
      )}
      {/* Calendar grid - Month view */}
      {view === 'month' && (
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday headers */}
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center font-semibold text-gray-500 py-2">{day}</div>
          ))}
          {/* Day cells */}
          {monthMatrix.map((week, i) =>
            week.map((date, j) => {
              const appointments = getAppointmentsForDate(date);
              return (
                <div
                  key={i + '-' + j}
                  className={`min-h-[80px] bg-gray-50 rounded-lg p-2 border flex flex-col gap-1 ${date ? 'cursor-pointer hover:bg-blue-50' : 'opacity-0 pointer-events-none'}`}
                  onClick={() => date && setModalDate(date)}
                >
                  {date && <div className="text-sm font-bold text-gray-700 mb-1">{date.getDate()}</div>}
                  {/* Appointments for this day */}
                  {appointments.map(appt => {
                    const patient = patients.find(p => p.id === appt.patientId);
                    return (
                      <div
                        key={appt.id}
                        className={`group flex items-center gap-2 px-2 py-1 rounded-lg border text-xs cursor-pointer hover:shadow-md transition-all ${statusColors[appt.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                        title={`${appt.title} with ${patient?.name || 'Unknown'} at ${new Date(appt.appointmentDate).toLocaleTimeString()}`}
                      >
                        <span className="text-xl">{getTreatmentIcon(appt.title)}</span>
                        <span className="font-bold">{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="truncate">{patient?.name || 'Unknown'}</span>
                        <span className="truncate">{appt.title}</span>
                        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[appt.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{appt.status}</span>
                        {/* Hover info */}
                        <div className="hidden group-hover:flex absolute z-10 left-1/2 -translate-x-1/2 top-10 bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex-col gap-2 min-w-[200px] text-xs text-gray-700">
                          <div><b>Time:</b> {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div><b>Patient:</b> {patient?.name || 'Unknown'}</div>
                          <div><b>Treatment:</b> {appt.title}</div>
                          <div><b>Status:</b> {appt.status}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      )}
      {/* Week navigation */}
      {view === 'week' && (
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevWeek} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">&lt;</button>
          <span className="font-semibold text-lg">
            {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
          </span>
          <button onClick={nextWeek} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">&gt;</button>
        </div>
      )}
      {/* Calendar grid - Week view */}
      {view === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday headers */}
          {WEEKDAYS.map((day, idx) => (
            <div key={day} className="text-center font-semibold text-gray-500 py-2">{day}</div>
          ))}
          {/* Day cells for the week */}
          {weekDates.map((date, idx) => {
            const appointments = getAppointmentsForDate(date);
            return (
              <div
                key={idx}
                className={`min-h-[80px] bg-gray-50 rounded-lg p-2 border flex flex-col gap-1 cursor-pointer hover:bg-blue-50`}
                onClick={() => setModalDate(date)}
              >
                <div className="text-sm font-bold text-gray-700 mb-1">{date.getDate()}</div>
                {/* Appointments for this day */}
                {appointments.map(appt => {
                  const patient = patients.find(p => p.id === appt.patientId);
                  return (
                    <div
                      key={appt.id}
                      className={`group flex items-center gap-2 px-2 py-1 rounded-lg border text-xs cursor-pointer hover:shadow-md transition-all ${statusColors[appt.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                      title={`${appt.title} with ${patient?.name || 'Unknown'} at ${new Date(appt.appointmentDate).toLocaleTimeString()}`}
                    >
                      <span className="text-xl">{getTreatmentIcon(appt.title)}</span>
                      <span className="font-bold">{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="truncate">{patient?.name || 'Unknown'}</span>
                      <span className="truncate">{appt.title}</span>
                      <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[appt.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>{appt.status}</span>
                      {/* Hover info */}
                      <div className="hidden group-hover:flex absolute z-10 left-1/2 -translate-x-1/2 top-10 bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex-col gap-2 min-w-[200px] text-xs text-gray-700">
                        <div><b>Time:</b> {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div><b>Patient:</b> {patient?.name || 'Unknown'}</div>
                        <div><b>Treatment:</b> {appt.title}</div>
                        <div><b>Status:</b> {appt.status}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
      {/* Modal for day details */}
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