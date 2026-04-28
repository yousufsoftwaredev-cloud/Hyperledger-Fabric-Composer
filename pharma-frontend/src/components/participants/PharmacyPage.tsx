import ParticipantPage from './ParticipantPage';

export default function PharmacyPage() {
  return (
    <ParticipantPage
      title="Pharmacies"
      type="pharmacy"
      fields={[
        { name: 'pharmacyId', label: 'Pharmacy ID', placeholder: 'e.g. PHA001' },
        { name: 'name',       label: 'Name',         placeholder: 'e.g. City Pharmacy' },
        { name: 'location',   label: 'Location',     placeholder: 'e.g. Lahore, Pakistan' },
      ]}
    />
  );
}
