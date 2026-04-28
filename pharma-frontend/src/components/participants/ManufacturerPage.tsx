import ParticipantPage from './ParticipantPage';

export default function ManufacturerPage() {
  return (
    <ParticipantPage
      title="Manufacturers"
      type="manufacturer"
      fields={[
        { name: 'manufacturerId', label: 'Manufacturer ID', placeholder: 'e.g. MFG001' },
        { name: 'name',           label: 'Name',             placeholder: 'e.g. PharmaCorp Ltd' },
        { name: 'location',       label: 'Location',         placeholder: 'e.g. Karachi, Pakistan' },
      ]}
    />
  );
}
