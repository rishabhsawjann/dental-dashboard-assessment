import React, { useState, useEffect } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Stethoscope, Search as SearchIcon, X } from 'lucide-react';


const getAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const getVisitCount = (patientId, incidents) => {
  return incidents.filter(incident => incident.patientId === patientId).length;
};

const getLastVisit = (patientId, incidents) => {
  const patientIncidents = incidents.filter(incident => incident.patientId === patientId);
  if (patientIncidents.length === 0) return null;
  return new Date(Math.max(...patientIncidents.map(i => new Date(i.appointmentDate))));
};

function PatientForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    name: '', dob: '', contact: '', healthInfo: '', gender: '', bloodGroup: '', tags: [], notes: '', profilePic: ''
  });
  const [imagePreview, setImagePreview] = useState(initial?.profilePic || '');
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm(f => ({ ...f, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (tag) => {
    if (tag && !form.tags.includes(tag)) {
      setForm(f => ({ ...f, tags: [...f.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove) => {
    setForm(f => ({ ...f, tags: f.tags.filter(tag => tag !== tagToRemove) }));
  };
  
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative border border-blue-100/50 animate-in slide-in-from-bottom-4 duration-300">
      
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-all duration-300 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-110"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          {initial ? 'Edit Patient' : 'Add New Patient'}
        </h3>
        
      </div>
      <p className="text-gray-600 text-sm mb-4">
        {initial ? 'Update patient information' : 'Enter patient details'}
      </p>
      <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-6">
        
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-100">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg text-gray-400">👤</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
              📷
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 hover:shadow-md" 
              value={form.name} 
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
              required 
              placeholder="Enter patient's full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 hover:shadow-md" 
              value={form.dob} 
              onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number *</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 hover:shadow-md" 
              value={form.contact} 
              onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} 
              required 
              placeholder="Enter contact number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 hover:shadow-md"
              value={form.gender}
              onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 hover:shadow-md"
              value={form.bloodGroup}
              onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Health Notes</label>
          <textarea 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 hover:shadow-md resize-none" 
            rows="3"
            value={form.healthInfo} 
            onChange={e => setForm(f => ({ ...f, healthInfo: e.target.value }))} 
            placeholder="Enter health notes, allergies, or special considerations"
          />
        </div>

       
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-blue-500 hover:text-blue-700">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Add tag (e.g., Allergic, VIP, Diabetic)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(e.target.value), e.target.value = '')}
            />
            <button type="button" onClick={() => addTag(document.querySelector('input[placeholder*="Add tag"]').value)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
          >
            {initial ? 'Update Patient' : 'Add Patient'}
          </button>
        </div>
      </form>
    </div>
  );
}

const sortFns = {
  name: (a, b) => a.name.localeCompare(b.name),
  dob: (a, b) => a.dob.localeCompare(b.dob),
  contact: (a, b) => a.contact.localeCompare(b.contact),
  age: (a, b) => getAge(a.dob) - getAge(b.dob),
  visits: (a, b, incidents) => getVisitCount(a.id, incidents) - getVisitCount(b.id, incidents),
};

export default function PatientsTable() {
  const { patients, incidents, addPatient, updatePatient, deletePatient } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [viewMode] = useState('table'); 
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  
  useEffect(() => { setCurrentPage(1); }, [search, sortBy, sortDir]);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.contact.toLowerCase().includes(search.toLowerCase()) ||
    (p.healthInfo || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );
  
  const sorted = [...filtered].sort((a, b) => {
    const res = sortFns[sortBy](a, b, incidents);
    return sortDir === 'asc' ? res : -res;
  });

  
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const PatientCard = ({ patient }) => {
    const age = getAge(patient.dob);
    const visitCount = getVisitCount(patient.id, incidents);
    const lastVisit = getLastVisit(patient.id, incidents);
    
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100/50 hover:border-blue-200/50 hover:scale-[1.02] transform group">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-blue-200/50">
            {patient.profilePic ? (
              <img src={patient.profilePic} alt={patient.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg text-blue-400">👤</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-blue-700 transition-colors duration-300">{patient.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{age} years old • {patient.gender || 'Not specified'}</p>
            <p className="text-gray-600 text-sm">{patient.contact}</p>
          </div>
        </div>
        
        {patient.tags && patient.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {patient.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">📊 {visitCount} visits</span>
          {lastVisit && <span className="flex items-center gap-1">Last: {lastVisit.toLocaleDateString()}</span>}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => { setEditPatient(patient); setShowForm(true); }} 
            className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md hover:scale-[1.02] transform"
          >
            Edit
          </button>
          <button 
            onClick={() => window.confirm('Are you sure you want to delete this patient?') && deletePatient(patient.id)} 
            className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-100 to-pink-100 text-red-700 hover:from-red-200 hover:to-pink-200 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md hover:scale-[1.02] transform"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-2xl shadow-xl p-8 border border-blue-100/50 backdrop-blur-sm">
      
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2 flex items-center gap-2" style={{lineHeight: '1.2'}}>
            Patient Management
            <Stethoscope className="w-8 h-8 text-black ml-2" />
          </h2>
          <p className="text-gray-600">Manage your patient records and information</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <input
              className="w-full sm:w-80 px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 hover:shadow-md bg-white/80 backdrop-blur-sm"
              placeholder="Search patients, tags, or health info..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button 
            onClick={() => { setEditPatient(null); setShowForm(true); }} 
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform whitespace-nowrap"
          >
            + Add Patient
          </button>
        </div>
      </div>

     
      {viewMode === 'cards' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.length === 0 ? (
              <div className="col-span-full text-center p-12">
                <div className="text-gray-400">
                  <div className="text-6xl mb-4 animate-pulse">📋</div>
                  <div className="text-lg font-semibold mb-2">No patients found</div>
                  <div className="text-sm">Try adjusting your search or add a new patient</div>
                </div>
              </div>
            ) : paginated.map(patient => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="px-3 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-blue-100 disabled:opacity-50 transition-all duration-300 border border-gray-200 hover:shadow-md"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-blue-100 disabled:opacity-50 transition-all duration-300 border border-gray-200 hover:shadow-md"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      
      {viewMode === 'table' && (
        <>
          <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/30 rounded-xl overflow-hidden border border-gray-200/50 backdrop-blur-sm shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/40">
                  <th className="p-4 text-left font-semibold text-gray-700">Patient</th>
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-blue-100/50 transition-all duration-300" 
                    onClick={() => handleSort('age')}
                  >
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                      <span>Age</span>
                      {sortBy === 'age' && <span className="text-blue-600 animate-pulse">{sortDir === 'asc' ? '▲' : '▼'}</span>}
                    </div>
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700">Contact</th>
                  <th 
                    className="p-4 text-left cursor-pointer hover:bg-blue-100/50 transition-all duration-300" 
                    onClick={() => handleSort('visits')}
                  >
                    <div className="flex items-center gap-2 font-semibold text-gray-700">
                      <span>Visits</span>
                      {sortBy === 'visits' && <span className="text-blue-600 animate-pulse">{sortDir === 'asc' ? '▲' : '▼'}</span>}
                    </div>
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700">Tags</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-12">
                      <div className="text-gray-400">
                        <div className="text-6xl mb-4 animate-pulse">📋</div>
                        <div className="text-lg font-semibold mb-2">No patients found</div>
                        <div className="text-sm">Try adjusting your search or add a new patient</div>
                      </div>
                    </td>
                  </tr>
                ) : paginated.map((patient, index) => {
                  const age = getAge(patient.dob);
                  const visitCount = getVisitCount(patient.id, incidents);
                  const lastVisit = getLastVisit(patient.id, incidents);
                  
                  return (
                    <tr key={patient.id} className={`border-b border-gray-100/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-300 ${index % 2 === 0 ? 'bg-white/60' : 'bg-gray-50/40'}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden shadow-sm border border-blue-200/50">
                            {patient.profilePic ? (
                              <img src={patient.profilePic} alt={patient.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg text-blue-400">👤</span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{patient.name}</div>
                            <div className="text-sm text-gray-600">{patient.gender || 'Not specified'} • {patient.bloodGroup || 'No blood group'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{age} years</td>
                      <td className="p-4 text-gray-700">{patient.contact}</td>
                      <td className="p-4">
                        <div className="text-gray-700 font-medium">{visitCount}</div>
                        {lastVisit && <div className="text-xs text-gray-500">Last: {lastVisit.toLocaleDateString()}</div>}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {patient.tags && patient.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                              {tag}
                            </span>
                          ))}
                          {patient.tags && patient.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-full text-xs font-medium border border-gray-200/50 shadow-sm">
                              +{patient.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { setEditPatient(patient); setShowForm(true); }} 
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md hover:scale-[1.02] transform"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => window.confirm('Are you sure you want to delete this patient?') && deletePatient(patient.id)} 
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-100 to-pink-100 text-red-700 hover:from-red-200 hover:to-pink-200 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md hover:scale-[1.02] transform"
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
                className="px-3 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-blue-100 disabled:opacity-50 transition-all duration-300 border border-gray-200 hover:shadow-md"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-blue-100 disabled:opacity-50 transition-all duration-300 border border-gray-200 hover:shadow-md"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <PatientForm
            initial={editPatient}
            onSave={data => {
              if (editPatient) updatePatient(editPatient.id, data);
              else addPatient(data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}