import { useState, useEffect } from 'react';
import { getAssets, getAssetById } from '../../services/api';
import ApiResult from '../shared/ApiResult';

interface Props {
  title: string;
  type: string;
}

export default function AssetPage({ title, type }: Props) {
  const [list, setList] = useState<{ loading: boolean; error?: string; data?: unknown }>({ loading: true });
  const [byId, setById] = useState<{ loading: boolean; error?: string; data?: unknown }>({ loading: false });
  const [lookupId, setLookupId] = useState('');

  useEffect(() => {
    getAssets<unknown>(type).then((res) => {
      if (res.success) setList({ loading: false, data: res.data });
      else setList({ loading: false, error: res.error });
    });
  }, [type]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setById({ loading: true });
    getAssetById<unknown>(type, lookupId).then((res) => {
      if (res.success) setById({ loading: false, data: res.data });
      else setById({ loading: false, error: res.error });
    });
  };

  const handleRefresh = () => {
    setList({ loading: true });
    getAssets<unknown>(type).then((res) => {
      if (res.success) setList({ loading: false, data: res.data });
      else setList({ loading: false, error: res.error });
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>{title}</h2>
        <button className="btn-secondary" onClick={handleRefresh}>↻ Refresh</button>
      </div>

      <div className="section-grid">
        <div className="section">
          <h3>All {title}</h3>
          <ApiResult loading={list.loading} error={list.error} data={list.data} />
        </div>

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
    </div>
  );
}
