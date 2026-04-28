import { useState, useEffect } from 'react';
import { getParticipants, getParticipantById, createParticipant } from '../../services/api';
import ApiResult from '../shared/ApiResult';
import FormField from '../shared/FormField';

interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'date' | 'checkbox' | 'number';
  placeholder?: string;
}

interface Props {
  title: string;
  type: string;
  fields: FieldDef[];
}

export default function ParticipantPage({ title, type, fields }: Props) {
  const [list, setList] = useState<{ loading: boolean; error?: string; data?: unknown }>({ loading: true });
  const [byId, setById] = useState<{ loading: boolean; error?: string; data?: unknown }>({ loading: false });
  const [create, setCreate] = useState<{ loading: boolean; error?: string; data?: unknown }>({ loading: false });

  const [lookupId, setLookupId] = useState('');
  const [form, setForm] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.type === 'checkbox' ? false : '']))
  );

  useEffect(() => {
    getParticipants<unknown>(type).then((res) => {
      if (res.success) setList({ loading: false, data: res.data });
      else setList({ loading: false, error: res.error });
    });
  }, [type]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setById({ loading: true });
    getParticipantById<unknown>(type, lookupId).then((res) => {
      if (res.success) setById({ loading: false, data: res.data });
      else setById({ loading: false, error: res.error });
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreate({ loading: true });
    createParticipant<unknown>(type, form).then((res) => {
      if (res.success) {
        setCreate({ loading: false, data: res.data });
        setForm(Object.fromEntries(fields.map((f) => [f.name, f.type === 'checkbox' ? false : ''])));
        // Refresh list
        getParticipants<unknown>(type).then((r) => {
          if (r.success) setList({ loading: false, data: r.data });
        });
      } else {
        setCreate({ loading: false, error: res.error });
      }
    });
  };

  const setField = (name: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="page">
      <div className="page-header">
        <h2>{title}</h2>
      </div>

      <div className="section-grid">
        {/* List all */}
        <div className="section">
          <h3>All {title}</h3>
          <ApiResult loading={list.loading} error={list.error} data={list.data} />
        </div>

        {/* Lookup by ID */}
        <div className="section">
          <h3>Lookup by ID</h3>
          <form onSubmit={handleLookup} className="inline-form">
            <input
              type="text"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Enter ID"
              required
            />
            <button type="submit" className="btn-primary">Fetch</button>
          </form>
          <ApiResult loading={byId.loading} error={byId.error} data={byId.data} />
        </div>
      </div>

      {/* Create */}
      <div className="section">
        <h3>Register New {title.replace(/s$/, '')}</h3>
        <form onSubmit={handleCreate} className="create-form">
          {fields.map((f) => (
            <FormField
              key={f.name}
              label={f.label}
              name={f.name}
              value={form[f.name]}
              onChange={setField}
              type={f.type}
              placeholder={f.placeholder}
              required={f.type !== 'checkbox'}
            />
          ))}
          <button type="submit" className="btn-primary" disabled={create.loading}>
            {create.loading ? 'Submitting…' : 'Create'}
          </button>
        </form>
        <ApiResult loading={false} error={create.error} data={create.data} />
      </div>
    </div>
  );
}
