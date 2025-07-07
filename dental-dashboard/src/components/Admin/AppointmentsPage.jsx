import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import jsPDF from 'jspdf';
import { CalendarClock, Hourglass, CheckCircle2, X, Search as SearchIcon, Sparkles, Smile, Brush, Wrench, Camera, Droplets, Pill, Stethoscope, Crown, Bone, Pencil } from 'lucide-react';
import SERVICES from '../../constants/services';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status', icon: null },
  { value: 'Pending', label: 'Pending', icon: <Hourglass className="w-4 h-4 text-amber-600 inline-block mr-2" /> },
  { value: 'Completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 inline-block mr-2" /> },
];

function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const selected = STATUS_OPTIONS.find(opt => opt.value === value) || STATUS_OPTIONS[0];
  
  return (
    <div className="relative min-w-[160px]">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 hover:shadow-md hover:border-slate-300"
        onClick={() => setOpen(o => !o)}
      >
        <span className="flex items-center">
          {selected.icon}
          {selected.label}
        </span>
        <svg className="w-4 h-4 ml-2 text-slate-400 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-xl">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`w-full flex items-center px-4 py-2 text-left hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 transition-all duration-200 ${value === opt.value ? 'bg-gradient-to-r from-sky-100 to-indigo-100' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              type="button"
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AppointmentModal({ initial, patients, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    patientId: '', title: '', description: '', appointmentDate: '', cost: '', status: 'Pending', files: [], notes: '', nextDate: '', locked: false
  });
  const [uploadedFiles, setUploadedFiles] = useState(initial?.files || []);
  const [noteInput, setNoteInput] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  
  const [appointmentDateOnly, setAppointmentDateOnly] = useState(() => {
    if (form.appointmentDate) {
      const dt = new Date(form.appointmentDate);
      if (!isNaN(dt)) return dt.toISOString().slice(0, 10);
    }
    return '';
  });
  const [appointmentTimeOnly, setAppointmentTimeOnly] = useState(() => {
    if (form.appointmentDate) {
      const dt = new Date(form.appointmentDate);
      if (!isNaN(dt)) return dt.toTimeString().slice(0, 5);
    }
    return '';
  });

  
  React.useEffect(() => {
    if (appointmentDateOnly && appointmentTimeOnly) {
      setForm(f => ({
        ...f,
        appointmentDate: `${appointmentDateOnly}T${appointmentTimeOnly}`
      }));
    }
  }, [appointmentDateOnly, appointmentTimeOnly]);

  
  React.useEffect(() => {
    if (initial && initial.appointmentDate) {
      const dt = new Date(initial.appointmentDate);
      if (!isNaN(dt)) {
        setAppointmentDateOnly(dt.toISOString().slice(0, 10));
        setAppointmentTimeOnly(dt.toTimeString().slice(0, 5));
      }
    }
  }, [initial]);

  const totalCost = (form.costItems || []).reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile = {
          name: file.name,
          url: reader.result,
          type: file.type,
          size: file.size
        };
        setUploadedFiles(prev => [...prev, newFile]);
        setForm(f => ({ ...f, files: [...(f.files || []), newFile] }));
      };
      reader.readAsDataURL(file);
    });
  };
  const removeFile = idx => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
    setForm(f => ({ ...f, files: (f.files || []).filter((_, i) => i !== idx) }));
  };

  const addNote = () => {
    if (noteInput.trim()) {
      const timestamp = new Date().toLocaleString();
      const newNote = `[${timestamp}] ${noteInput}`;
      setForm(f => ({ ...f, notes: f.notes ? `${f.notes}\n${newNote}` : newNote }));
      setNoteInput('');
    }
  };

  const generateInvoice = () => {
    const patient = patients.find(p => p.id === form.patientId);
    const doc = new jsPDF();
    doc.text('DentalCare Clinic Invoice', 10, 10);
    doc.text(`Patient: ${patient?.name || ''}`, 10, 20);
    doc.text(`Date: ${form.appointmentDate}`, 10, 30);
    doc.text('Treatment:', 10, 40);
    doc.text(form.title, 30, 50);
    doc.text('Cost Breakdown:', 10, 60);
    (form.costItems || []).forEach((item, idx) => {
      doc.text(`${item.label}: $${item.amount}`, 20, 70 + idx * 10);
    });
    doc.text(`Total: $${totalCost}`, 10, 80 + (form.costItems?.length || 0) * 10);
    doc.text(`Status: ${form.status}`, 10, 90 + (form.costItems?.length || 0) * 10);
    doc.save(`invoice_${patient?.name || 'patient'}.pdf`);
  };

  const toggleLock = () => setForm(f => ({ ...f, locked: !f.locked }));

  const handleServiceChange = (e) => {
    const selected = SERVICES.find(s => s.label === e.target.value);
    setForm(f => ({
      ...f,
      title: e.target.value,
      cost: selected ? selected.price : ''
    }));
    if (e.target.value !== 'Other') setCustomTitle('');
  };

  const lucideIconMap = {
    Sparkles,
    Smile,
    Brush,
    Wrench,
    Camera,
    Droplets,
    Pill,
    Stethoscope,
    Crown,
    Bone,
    Pencil,
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative border border-slate-100">
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-all duration-300 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 hover:bg-slate-100"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            {initial ? 'Edit Appointment' : 'New Appointment'}
          </h3>
          <p className="text-slate-600 text-sm">
            {initial ? 'Update appointment details' : 'Schedule a new appointment'}
          </p>
        </div>
        {form.locked && <span className="text-2xl text-slate-400 ml-4 animate-pulse" title="Locked">🔒</span>}
      </div>
      <form onSubmit={e => { e.preventDefault(); onSave({ ...form, cost: (form.costItems && form.costItems.length > 0) ? totalCost : form.cost }); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Patient *</label>
            <select
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 bg-white/80 backdrop-blur-sm"
              value={form.patientId}
              onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))}
              required
              disabled={form.locked}
            >
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Service *</label>
            <select
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 bg-white/80 backdrop-blur-sm"
              value={form.title}
              onChange={handleServiceChange}
              required
              disabled={form.locked}
            >
              <option value="">Select Service</option>
              {SERVICES.map(s => (
                <option key={s.label} value={s.label}>
                  {lucideIconMap[s.icon] ? React.createElement(lucideIconMap[s.icon], { className: 'inline w-5 h-5 mr-1 align-text-bottom text-sky-500' }) : <Smile className="inline w-5 h-5 mr-1 align-text-bottom text-sky-500" />} {s.label} {s.price ? `($${s.price})` : ''}
                </option>
              ))}
            </select>
            {form.title === 'Other' && (
              <input
                className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 bg-white/80 backdrop-blur-sm"
                placeholder="Enter custom service title"
                value={customTitle}
                onChange={e => {
                  setCustomTitle(e.target.value);
                  setForm(f => ({ ...f, title: e.target.value }));
                }}
                disabled={form.locked}
              />
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
          <textarea
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 bg-white/80 backdrop-blur-sm resize-none"
            rows="3"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe the treatment or issue"
            disabled={form.locked}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Appointment Date *</label>
            <div className="flex gap-2">
              <input
                type="date"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 bg-white/80 backdrop-blur-sm"
                value={appointmentDateOnly}
                onChange={e => setAppointmentDateOnly(e.target.value)}
                required
                disabled={form.locked}
              />
              <input
                type="time"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 bg-white/80 backdrop-blur-sm"
                value={appointmentTimeOnly}
                onChange={e => setAppointmentTimeOnly(e.target.value)}
                required
                disabled={form.locked}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 bg-white/80 backdrop-blur-sm"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              disabled={form.locked}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Cost ($)</label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 bg-white/80 backdrop-blur-sm"
            value={form.cost}
            onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
            placeholder="0.00"
            disabled={form.locked}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
            className="w-full"
              disabled={form.locked}
            />
          <div className="flex flex-wrap gap-2 mt-2">
              {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-200 px-2 py-1 rounded-lg shadow-sm">
                <span className="text-xs">{file.name}</span>
                <button type="button" onClick={() => removeFile(idx)} className="text-rose-500 hover:text-rose-700 transition-colors duration-200">&times;</button>
                </div>
              ))}
            </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
          <textarea
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 bg-white/80 backdrop-blur-sm resize-none"
            rows="2"
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
            placeholder="Add a note"
              disabled={form.locked}
            />
          <button type="button" onClick={addNote} className="mt-2 px-3 py-1 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-lg hover:from-sky-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">Add Note</button>
          <div className="mt-2 text-xs text-slate-600 whitespace-pre-line">{form.notes}</div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white font-semibold hover:from-sky-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
            {initial ? 'Update Appointment' : 'Add Appointment'}
          </button>
          <button type="button" onClick={generateInvoice} className="px-4 py-3 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 font-semibold hover:from-slate-300 hover:to-slate-400 transition-all duration-300 shadow-md hover:shadow-lg">Invoice</button>
          <button type="button" onClick={toggleLock} className={`px-4 py-3 rounded-xl ${form.locked ? 'bg-gradient-to-r from-rose-200 to-pink-200 text-rose-700' : 'bg-gradient-to-r from-emerald-200 to-green-200 text-emerald-700'} font-semibold hover:opacity-80 transition-all duration-300 shadow-md hover:shadow-lg`}>
            {form.locked ? 'Unlock' : 'Lock'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AppointmentsPage() {
  const { patients, incidents, addIncident, updateIncident, deleteIncident } = useAppData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editIncident, setEditIncident] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = incidents.filter(i => {
    const patient = patients.find(p => p.id === i.patientId);
    const matchesSearch =
      (patient?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  const getStatusBadgeProps = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
          text: 'text-amber-700',
          stroke: 'stroke-amber-700',
          icon: <Hourglass className="w-5 h-5 stroke-2 stroke-amber-700" />,
        };
      case 'Completed':
        return {
          bg: 'bg-gradient-to-r from-emerald-100 to-green-100',
          text: 'text-emerald-700',
          stroke: 'stroke-emerald-700',
          icon: <CheckCircle2 className="w-5 h-5 stroke-2 stroke-emerald-700" />,
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-100 to-gray-100',
          text: 'text-slate-700',
          stroke: 'stroke-slate-700',
          icon: <CalendarClock className="w-5 h-5 stroke-2 stroke-slate-700" />,
        };
    }
  };

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/30 rounded-2xl shadow-xl p-8 border border-slate-100">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">All Appointments</h2>
            <CalendarClock className="w-9 h-9 text-slate-700 opacity-80" />
          </div>
          <p className="text-slate-600">Manage and track all appointments across patients</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              className="w-full sm:w-80 px-4 py-3 pl-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 hover:border-slate-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
              placeholder="Search by patient, title, or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 w-5 h-5" />
          </div>
          <StatusDropdown value={statusFilter} onChange={setStatusFilter} />
          <button
            onClick={() => { setEditIncident(null); setShowModal(true); }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white font-semibold hover:from-sky-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] whitespace-nowrap"
          >
            + Add Appointment
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl overflow-x-auto shadow-inner border border-slate-200">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50">
              <th className="p-4 text-left font-semibold text-slate-700">Patient</th>
              <th className="p-4 text-left font-semibold text-slate-700">Title</th>
              <th className="p-4 text-left font-semibold text-slate-700">Date & Time</th>
              <th className="p-4 text-left font-semibold text-slate-700">Status</th>
              <th className="p-4 text-left font-semibold text-slate-700">Cost</th>
              <th className="p-4 text-left font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-12">
                  <div className="text-slate-400">
                    <div className="text-6xl mb-4 animate-pulse">📅</div>
                    <div className="text-lg font-semibold mb-2">No appointments found</div>
                    <div className="text-sm">Try adjusting your search or add a new appointment</div>
                  </div>
                </td>
              </tr>
            ) : paginated.map((i, idx) => {
              const patient = patients.find(p => p.id === i.patientId);
              const badge = getStatusBadgeProps(i.status);
              return (
                <tr key={i.id} className={`border-b border-slate-100 hover:bg-gradient-to-r hover:from-sky-50/80 hover:to-indigo-50/80 transition-all duration-300 ${idx % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden shadow-sm">
                        {patient?.profilePic ? (
                          <img src={patient.profilePic} alt={patient.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg text-slate-400">👤</span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{patient?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500">{patient?.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{i.title}</td>
                  <td className="p-4 text-slate-700">
                    {new Date(i.appointmentDate).toLocaleDateString()}<br />
                    <span className="text-xs text-slate-500">{new Date(i.appointmentDate).toLocaleTimeString()}</span>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-2 rounded-full px-3 py-1 font-medium text-sm shadow-sm ${badge.bg} ${badge.text}`}>{badge.icon} {i.status}</span>
                  </td>
                  <td className="p-4 align-middle">
                    {typeof i.cost !== 'undefined' && i.cost !== '' && i.cost !== null
                      ? <span className={i.status === 'Completed' ? 'text-emerald-600 font-semibold' : 'text-slate-700'}>
                          ${parseFloat(i.cost) % 1 === 0 ? parseInt(i.cost) : parseFloat(i.cost).toFixed(2)}
                        </span>
                      : <span className="text-slate-400">-</span>
                    }
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditIncident(i); setShowModal(true); }}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 hover:from-sky-200 hover:to-blue-200 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => window.confirm('Delete this appointment?') && deleteIncident(i.id)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 hover:from-rose-200 hover:to-pink-200 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 transition-all duration-300 shadow-sm hover:shadow-md"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 transition-all duration-300 shadow-sm hover:shadow-md"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <AppointmentModal
            initial={editIncident}
            patients={patients}
            onSave={data => {
              if (editIncident) updateIncident(editIncident.id, data);
              else addIncident(data);
              setShowModal(false);
            }}
            onCancel={() => setShowModal(false)}
          />
        </div>
      )}
    </div>
  );
}