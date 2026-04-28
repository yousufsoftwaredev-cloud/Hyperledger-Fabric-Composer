interface Props {
  loading: boolean;
  error?: string;
  data?: unknown;
}

export default function ApiResult({ loading, error, data }: Props) {
  if (loading) return <div className="api-loading">Loading…</div>;
  if (error) return <div className="api-error">Error: {error}</div>;
  if (data === undefined) return null;
  return (
    <div className="api-result">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
