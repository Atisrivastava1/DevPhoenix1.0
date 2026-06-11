"use client";
import { useState } from 'react';
import { Search, Plus, Mail, Phone, MapPin, Building2, Download, Trash2, Edit2 } from 'lucide-react';
import { Button } from "@/components/ui/Button";

const staticContacts = [
  { id: 1, name: 'Ananya Sharma', email: 'ananya@gmail.com', phone: '+91 98765 43210', company: 'Tech Mahindra', role: 'Full Stack Engineer', city: 'Mumbai' },
  { id: 2, name: 'Rahul Verma', email: 'rahul.verma@yahoo.com', phone: '+91 91234 56789', company: 'TCS', role: 'DevOps Specialist', city: 'Bangalore' },
  { id: 3, name: 'Pooja Patel', email: 'pooja.patel@outlook.com', phone: '+91 88776 65544', company: 'Wipro', role: 'UI Developer', city: 'Pune' },
  { id: 4, name: 'Amit Singh', email: 'amit.singh@gmail.com', phone: '+91 77665 54433', company: 'Infosys', role: 'QA Lead', city: 'Noida' },
  { id: 5, name: 'Sneha Reddy', email: 'sneha@google.com', phone: '+91 90001 20002', company: 'Google', role: 'Cloud Engineer', city: 'Hyderabad' },
];

export default function ContactsPage() {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState(staticContacts);

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contacts Directory</h1>
          <p className="text-sm text-slate-500 font-medium">Manage corporate students and organization profiles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>
            Add Contact
          </Button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, company, email..."
          className="w-full h-11 bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
        />
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/50">
              <tr>
                {['Name & Role', 'Company', 'Contact Info', 'Location', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{c.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{c.role}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {c.company}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 text-xs flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" /> {c.email}
                    </p>
                    <p className="text-slate-600 text-xs mt-1 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {c.phone}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 text-xs flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.city}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
