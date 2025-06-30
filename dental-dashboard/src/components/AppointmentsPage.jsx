import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import jsPDF from 'jspdf';
import { UserRound, CalendarClock, Hourglass, CheckCircle2, DollarSign } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
    case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending': return <Hourglass className="w-6 h-6 stroke-2 text-yellow-600" />;
    case 'Completed': return <CheckCircle2 className="w-6 h-6 stroke-2 text-green-600" />;
    case 'Cancelled': return <CalendarClock className="w-6 h-6 stroke-2 text-red-600" />;
    case 'In Progress': return <CalendarClock className="w-6 h-6 stroke-2 text-blue-600" />;
    default: return <CalendarClock className="w-6 h-6 stroke-2 text-slate-400" />;
  }
};

const treatmentSuggestions = [
  { keyword: 'toothache', suggestions: ['Cavity Filling', 'Pain Relief', 'X-ray'] },
  { keyword: 'cleaning', suggestions: ['Scaling', 'Polishing', 'Fluoride Treatment'] },
  { keyword: 'filling', suggestions: ['Composite Filling', 'Amalgam Filling'] },
  { keyword: 'extraction', suggestions: ['Simple Extraction', 'Surgical Extraction'] },
  { keyword: 'root canal', suggestions: ['Root Canal Therapy', 'Temporary Filling'] },
];

const SERVICES = [
  { label: 'Dental Cleaning', icon: '🧼', price: 60 },
  { label: 'Tooth Extraction', icon: '🦷', price: 150 },
  { label: 'Cavity Filling', icon: '🪥', price: 80 },
  { label: 'Root Canal', icon: '🔧', price: 200 },
  { label: 'Teeth Whitening', icon: '✨', price: 120 },
  { label: 'Braces Consultation', icon: '😬', price: 70 },
  { label: 'X-ray', icon: '📷', price: 40 },
  { label: 'Scaling & Polishing', icon: '🪣', price: 90 },
  { label: 'Pain Relief', icon: '💊', price: 30 },
  { label: 'Checkup', icon: '🩺', price: 50 },
  { label: 'Crowns & Bridges', icon: '👑', price: 250 },
  { label: 'Veneers', icon: '🦷', price: 300 },
  { label: 'Implants', icon: '🦾', price: 500 },
  { label: 'Other', icon: '✏️', price: 0 },
];

function AppointmentModal({ initial, patients, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    patientId: '', title: '', description: '', appointmentDate: '', cost: '', status: 'Pending', files: [], notes: '', nextDate: '', locked: false
  });
  const [costItem, setCostItem] = useState({ label: '', amount: '' });
  const [uploadedFiles, setUploadedFiles] = useState(initial?.files || []);
  const [noteInput, setNoteInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState(false);
  const [customTitle, setCustomTitle] = useState('');

  // Cost breakdown
  const addCostItem = () => {
    if (costItem.label && costItem.amount) {
      setForm(f => ({ ...f, costItems: [...(f.costItems || []), { ...costItem }] }));
      setCostItem({ label: '', amount: '' });
    }
  };
  const removeCostItem = idx => {
    setForm(f => ({ ...f, costItems: f.costItems.filter((_, i) => i !== idx) }));
  };
  const totalCost = (form.costItems || []).reduce((sum, item) => sum + parseFloat(item.amount || 0), 0) - parseFloat(discount || 0);

  // File upload
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

  // Dentist notes
  const addNote = () => {
    if (noteInput.trim()) {
      const timestamp = new Date().toLocaleString();
      const newNote = `[${timestamp}] ${noteInput}`;
      setForm(f => ({ ...f, notes: f.notes ? `${f.notes}\n${newNote}` : newNote }));
      setNoteInput('');
    }
  };

  // Smart treatment suggestions
  const getSuggestions = () => {
    const lowerTitle = (form.title || '').toLowerCase();
    for (const entry of treatmentSuggestions) {
      if (lowerTitle.includes(entry.keyword)) return entry.suggestions;
    }
    return [];
  };
  const insertSuggestion = suggestion => {
    setForm(f => ({ ...f, description: f.description ? `${f.description}, ${suggestion}` : suggestion }));
  };

  // Invoice generation
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
    doc.text(`Discount: $${discount}`, 20, 80 + (form.costItems?.length || 0) * 10);
    doc.text(`Total: $${totalCost}`, 10, 90 + (form.costItems?.length || 0) * 10);
    doc.text(`Status: ${form.status}`, 10, 100 + (form.costItems?.length || 0) * 10);
    doc.save(`invoice_${patient?.name || 'patient'}.pdf`);
  };

  // Lock record
  const toggleLock = () => setForm(f => ({ ...f, locked: !f.locked }));

  // Update cost automatically when service changes
  const handleServiceChange = (e) => {
    const selected = SERVICES.find(s => s.label === e.target.value);
    setForm(f => ({
      ...f,
      title: e.target.value,
      cost: selected ? selected.price : ''
    }));
    if (e.target.value !== 'Other') setCustomTitle('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {initial ? 'Edit Appointment' : 'New Appointment'}
          </h3>
          <p className="text-gray-600 text-sm">
            {initial ? 'Update appointment details' : 'Schedule a new appointment'}
          </p>
        </div>
        {form.locked && <span className="text-2xl text-gray-400 ml-4" title="Locked">🔒</span>}
      </div>
      <form onSubmit={e => { e.preventDefault(); onSave({ ...form, cost: (form.costItems && form.costItems.length > 0) ? totalCost : form.cost, paid }); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Patient *</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Service *</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={form.title}
              onChange={handleServiceChange}
              required
              disabled={form.locked}
            >
              <option value="">Select Service</option>
              {SERVICES.map(s => (
                <option key={s.label} value={s.label}>{s.icon} {s.label} {s.price ? `($${s.price})` : ''}</option>
              ))}
            </select>
            {form.title === 'Other' && (
              <input
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter custom service title"
                value={customTitle}
                onChange={e => {
                  setCustomTitle(e.target.value);
                  setForm(f => ({ ...f, title: e.target.value }));
                }}
                required
                disabled={form.locked}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time *</label>
            <input
              type="datetime-local"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white appearance-none shadow-sm placeholder-gray-400"
              value={form.appointmentDate}
              onChange={e => setForm(f => ({ ...f, appointmentDate: e.target.value }))}
              required
              disabled={form.locked}
              style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              disabled={form.locked}
            >
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">🔄 In Progress</option>
              <option value="Completed">✅ Completed</option>
              <option value="Cancelled">❌ Cancelled</option>
            </select>
          </div>
        </div>
        {/* Cost field (auto-filled, editable only for 'Other') */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cost ($)</label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={form.cost}
            onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
            placeholder="0.00"
            required
            disabled={form.locked || form.title !== 'Other'}
          />
        </div>
        {/* Next appointment date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Next Appointment Date</label>
          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={form.nextDate}
            onChange={e => setForm(f => ({ ...f, nextDate: e.target.value }))}
            disabled={form.locked}
          />
          {form.status === 'Completed' && !form.locked && (
            <button type="button" onClick={() => {
              const today = new Date();
              const next = new Date(today.setMonth(today.getMonth() + 6));
              setForm(f => ({ ...f, nextDate: next.toISOString().split('T')[0] }));
            }} className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">Suggest 6 months</button>
          )}
        </div>
        {/* File upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Attachments</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={form.locked}
            />
            <label htmlFor="file-upload" className={`cursor-pointer ${form.locked ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="text-4xl mb-2">📎</div>
              <div className="text-gray-600">Click to upload files (images, PDFs, documents)</div>
              <div className="text-sm text-gray-500 mt-1">Drag and drop files here</div>
            </label>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="relative bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl mb-2">
                    {file.type.startsWith('image/') ? '🖼️' : '📄'}
                  </div>
                  <div className="text-xs text-gray-600 truncate">{file.name}</div>
                  {!form.locked && (
                    <button type="button" onClick={() => removeFile(idx)} className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-sm">×</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Dentist notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Dentist Notes (timestamped)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a note..."
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              disabled={form.locked}
            />
            <button type="button" onClick={addNote} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={form.locked}>Add</button>
          </div>
          {form.notes && (
            <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              {form.notes.split('\n').map((note, idx) => (
                <div key={idx} className="text-sm text-gray-700 mb-1">{note}</div>
              ))}
            </div>
          )}
        </div>
        {/* Action buttons */}
        <div className="flex gap-3 pt-4 flex-wrap">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={form.locked}
          >
            {initial ? 'Update Appointment' : 'Create Appointment'}
          </button>
          <button type="button" onClick={generateInvoice} className="flex-1 px-6 py-3 rounded-xl bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-all duration-200 shadow-lg hover:shadow-xl">📄 Generate Invoice</button>
          <button type="button" onClick={toggleLock} className={`flex-1 px-6 py-3 rounded-xl ${form.locked ? 'bg-gray-300 text-gray-600' : 'bg-yellow-100 text-yellow-700'} font-semibold hover:bg-yellow-200 transition-all duration-200 shadow-lg hover:shadow-xl`}>
            {form.locked ? 'Unlock' : 'Lock Record'} {form.locked ? '🔓' : '🔒'}
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
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          stroke: 'stroke-yellow-700',
          icon: <Hourglass className="w-5 h-5 stroke-2 stroke-yellow-700" />,
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          stroke: 'stroke-blue-700',
          icon: <CalendarClock className="w-5 h-5 stroke-2 stroke-blue-700" />,
        };
      case 'Completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          stroke: 'stroke-green-700',
          icon: <CheckCircle2 className="w-5 h-5 stroke-2 stroke-green-700" />,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          stroke: 'stroke-gray-700',
          icon: <CalendarClock className="w-5 h-5 stroke-2 stroke-gray-700" />,
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">All Appointments</h2>
          <p className="text-gray-600">Manage and track all appointments across patients</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              className="w-full sm:w-80 px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Search by patient, title, or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <select
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">⏳ Pending</option>
            <option value="In Progress">🔄 In Progress</option>
            <option value="Completed">✅ Completed</option>
            <option value="Cancelled">❌ Cancelled</option>
          </select>
          <button
            onClick={() => { setEditIncident(null); setShowModal(true); }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            + Add Appointment
          </button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <th className="p-4 text-left font-semibold text-gray-700">Patient</th>
              <th className="p-4 text-left font-semibold text-gray-700">Title</th>
              <th className="p-4 text-left font-semibold text-gray-700">Date & Time</th>
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left font-semibold text-gray-700">Cost</th>
              <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-12">
                  <div className="text-gray-400">
                    <div className="text-6xl mb-4">📅</div>
                    <div className="text-lg font-semibold mb-2">No appointments found</div>
                    <div className="text-sm">Try adjusting your search or add a new appointment</div>
                  </div>
                </td>
              </tr>
            ) : sorted.map((i, idx) => {
              const patient = patients.find(p => p.id === i.patientId);
              const badge = getStatusBadgeProps(i.status);
              return (
                <tr key={i.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-all duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {patient?.profilePic ? (
                          <img src={patient.profilePic} alt={patient.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg text-gray-400">👤</span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{patient?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">{patient?.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-700">{i.title}</td>
                  <td className="p-4 text-gray-700">
                    {new Date(i.appointmentDate).toLocaleDateString()}<br />
                    <span className="text-xs text-gray-500">{new Date(i.appointmentDate).toLocaleTimeString()}</span>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-2 rounded-full px-3 py-1 font-medium text-sm ${badge.bg} ${badge.text}`}>{badge.icon} {i.status}</span>
                  </td>
                  <td className="p-4 align-middle">
                    {typeof i.cost !== 'undefined' && i.cost !== '' && i.cost !== null
                      ? <span className={i.status === 'Completed' ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                          ${parseFloat(i.cost) % 1 === 0 ? parseInt(i.cost) : parseFloat(i.cost).toFixed(2)}
                        </span>
                      : <span className="text-gray-400">-</span>
                    }
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditIncident(i); setShowModal(true); }}
                        className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => window.confirm('Delete this appointment?') && deleteIncident(i.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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