import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { CalendarClock, Hourglass, CheckCircle2 } from 'lucide-react';


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

const getTreatmentIcon = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('cleaning')) return '🧼';
  if (lowerTitle.includes('filling')) return '🦷';
  if (lowerTitle.includes('extraction')) return '🦷';
  if (lowerTitle.includes('root canal')) return '🔧';
  if (lowerTitle.includes('whitening')) return '✨';
  if (lowerTitle.includes('x-ray')) return '📷';
  return '🦷';
};


const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Status', icon: null },
  { value: 'Pending', label: 'Pending', icon: <Hourglass className="w-4 h-4 text-yellow-600 inline-block mr-2" /> },
  { value: 'In Progress', label: 'In Progress', icon: <CalendarClock className="w-4 h-4 text-blue-600 inline-block mr-2" /> },
  { value: 'Completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4 text-green-600 inline-block mr-2" /> },
  { value: 'Cancelled', label: 'Cancelled', icon: <CalendarClock className="w-4 h-4 text-red-600 inline-block mr-2" /> },
];

function StatusFilterDropdown({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const selected = STATUS_FILTER_OPTIONS.find(opt => opt.value === value) || STATUS_FILTER_OPTIONS[0];
  return (
    <div className="relative min-w-[160px]">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md hover:border-gray-400"
        onClick={() => setOpen(o => !o)}
      >
        <span className="flex items-center">
          {selected.icon}
          {selected.label}
        </span>
        <svg className="w-4 h-4 ml-2 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl">
          {STATUS_FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`w-full flex items-center px-4 py-2 text-left hover:bg-blue-50 transition-all duration-200 ${value === opt.value ? 'bg-blue-100' : ''}`}
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

function IncidentForm({ initial, patientId, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    title: '', description: '', comments: '', appointmentDate: '', 
    cost: '', treatment: '', status: 'Pending', nextDate: '', files: []
  });
  const [uploadedFiles, setUploadedFiles] = useState(initial?.files || []);

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
        setForm(f => ({ ...f, files: [...f.files, newFile] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setForm(f => ({ ...f, files: f.files.filter((_, i) => i !== index) }));
  };

  const addComment = (comment) => {
    if (comment.trim()) {
      const timestamp = new Date().toLocaleString();
      const newComment = `[${timestamp}] ${comment}`;
      setForm(f => ({ 
        ...f, 
        comments: f.comments ? `${f.comments}\n${newComment}` : newComment 
      }));
    }
  };

  const suggestNextVisit = () => {
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setMonth(today.getMonth() + 6);
    setForm(f => ({ ...f, nextDate: nextDate.toISOString().split('T')[0] }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {initial ? 'Edit Appointment' : 'New Appointment'}
        </h3>
        <p className="text-gray-600 text-sm">
          {initial ? 'Update appointment details' : 'Schedule a new appointment'}
        </p>
      </div>
      
      <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Treatment Title *</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              value={form.title} 
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
              required 
              placeholder="e.g., Dental Cleaning, Root Canal"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Date & Time *</label>
            <input 
              type="datetime-local" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              value={form.appointmentDate} 
              onChange={e => setForm(f => ({ ...f, appointmentDate: e.target.value }))} 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none" 
            rows="3"
            value={form.description} 
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
            placeholder="Describe the treatment or issue"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            >
              <option value="Pending">⏳ Pending</option>
              <option value="In Progress">🔄 In Progress</option>
              <option value="Completed">✅ Completed</option>
              <option value="Cancelled">❌ Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cost ($)</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              value={form.cost} 
              onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} 
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Next Visit Date</label>
            <div className="flex gap-2">
              <input 
                type="date" 
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                value={form.nextDate} 
                onChange={e => setForm(f => ({ ...f, nextDate: e.target.value }))} 
              />
              <button 
                type="button"
                onClick={suggestNextVisit}
                className="px-3 py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
                title="Suggest 6 months from now"
              >
                🤖
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Treatment Notes</label>
          <textarea 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none" 
            rows="3"
            value={form.treatment} 
            onChange={e => setForm(f => ({ ...f, treatment: e.target.value }))} 
            placeholder="Detailed treatment notes and recommendations"
          />
        </div>

        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Comments & Notes</label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addComment(e.target.value), e.target.value = '')}
              />
              <button 
                type="button" 
                onClick={() => addComment(document.querySelector('input[placeholder="Add a comment..."]').value)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {form.comments && (
              <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                {form.comments.split('\n').map((comment, index) => (
                  <div key={index} className="text-sm text-gray-700 mb-1">{comment}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        
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
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-4xl mb-2">📎</div>
              <div className="text-gray-600">Click to upload files (images, PDFs, documents)</div>
              <div className="text-sm text-gray-500 mt-1">Drag and drop files here</div>
            </label>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl mb-2">
                    {file.type.startsWith('image/') ? '🖼️' : '📄'}
                  </div>
                  <div className="text-xs text-gray-600 truncate">{file.name}</div>
                  <button 
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
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
          >
            {initial ? 'Update Appointment' : 'Create Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function IncidentManagement({ patientId }) {
  const { incidents, addIncident, updateIncident, deleteIncident, patients } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [editIncident, setEditIncident] = useState(null);
  const [viewMode, setViewMode] = useState('timeline'); 
  const [filterStatus, setFilterStatus] = useState('all');

  const patient = patients.find(p => p.id === patientId);
  const patientIncidents = incidents.filter(i => i.patientId === patientId);
  const filteredIncidents = filterStatus === 'all' 
    ? patientIncidents 
    : patientIncidents.filter(i => i.status === filterStatus);

  const sortedIncidents = [...filteredIncidents].sort((a, b) => 
    new Date(b.appointmentDate) - new Date(a.appointmentDate)
  );

  const totalCost = patientIncidents.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
  const completedCount = patientIncidents.filter(i => i.status === 'Completed').length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {patient?.name}'s Appointments
          </h2>
          <p className="text-gray-600">Manage appointments and treatment history</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'timeline' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📜 Timeline
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Table
            </button>
          </div>
          <button 
            onClick={() => { setEditIncident(null); setShowForm(true); }} 
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            + New Appointment
          </button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{patientIncidents.length}</div>
          <div className="text-sm text-blue-700">Total Appointments</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-sm text-green-700">Completed</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {patientIncidents.filter(i => i.status === 'Pending').length}
          </div>
          <div className="text-sm text-yellow-700">Pending</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">${totalCost.toFixed(2)}</div>
          <div className="text-sm text-purple-700">Total Revenue</div>
        </div>
      </div>

      
      <div className="mb-6">
        <StatusFilterDropdown value={filterStatus} onChange={setFilterStatus} />
      </div>

      
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {sortedIncidents.length === 0 ? (
            <div className="text-center p-12">
              <div className="text-gray-400">
                <div className="text-6xl mb-4">📅</div>
                <div className="text-lg font-semibold mb-2">No appointments found</div>
                <div className="text-sm">Create the first appointment for this patient</div>
              </div>
            </div>
          ) : sortedIncidents.map((incident, index) => (
            <div key={incident.id} className="relative">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {getTreatmentIcon(incident.title)}
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{incident.title}</h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(incident.appointmentDate).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(incident.status)}`}>
                      {getStatusIcon(incident.status)} {incident.status}
                    </span>
                  </div>
                  
                  {incident.description && (
                    <p className="text-gray-700 mb-3">{incident.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                    {incident.cost && (
                      <div className="text-green-600 font-semibold">Cost: ${incident.cost}</div>
                    )}
                    {incident.nextDate && (
                      <div className="text-blue-600">Next: {new Date(incident.nextDate).toLocaleDateString()}</div>
                    )}
                    {incident.files && incident.files.length > 0 && (
                      <div className="text-gray-600">📎 {incident.files.length} files</div>
                    )}
                  </div>
                  
                  {incident.treatment && (
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <div className="font-semibold text-gray-800 mb-1">Treatment Notes:</div>
                      <div className="text-gray-700 text-sm">{incident.treatment}</div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditIncident(incident); setShowForm(true); }} 
                      className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => window.confirm('Delete this appointment?') && deleteIncident(incident.id)} 
                      className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              {index < sortedIncidents.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-6 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      )}

      
      {viewMode === 'table' && (
        <div className="bg-gray-50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <th className="p-4 text-left font-semibold text-gray-700">Treatment</th>
                <th className="p-4 text-left font-semibold text-gray-700">Date & Time</th>
                <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                <th className="p-4 text-left font-semibold text-gray-700">Cost</th>
                <th className="p-4 text-left font-semibold text-gray-700">Next Visit</th>
                <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-12">
                    <div className="text-gray-400">
                      <div className="text-6xl mb-4">📅</div>
                      <div className="text-lg font-semibold mb-2">No appointments found</div>
                      <div className="text-sm">Create the first appointment for this patient</div>
                    </div>
                  </td>
                </tr>
              ) : sortedIncidents.map((incident, index) => (
                <tr key={incident.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTreatmentIcon(incident.title)}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{incident.title}</div>
                        {incident.description && (
                          <div className="text-sm text-gray-600 truncate max-w-xs">{incident.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">
                    {new Date(incident.appointmentDate).toLocaleDateString()}
                    <div className="text-sm text-gray-500">
                      {new Date(incident.appointmentDate).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(incident.status)}`}>
                      {getStatusIcon(incident.status)} {incident.status}
                    </span>
                  </td>
                  <td className="p-4 text-green-600 font-semibold">
                    {incident.cost ? `${incident.cost}` : '-'}
                  </td>
                  <td className="p-4 text-gray-700">
                    {incident.nextDate ? new Date(incident.nextDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditIncident(incident); setShowForm(true); }} 
                        className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => window.confirm('Delete this appointment?') && deleteIncident(incident.id)} 
                        className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <IncidentForm
            initial={editIncident}
            patientId={patientId}
            onSave={data => {
              if (editIncident) updateIncident(editIncident.id, data);
              else addIncident({ ...data, patientId });
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}