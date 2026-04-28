import ParticipantPage from './ParticipantPage';

export default function CitizenPage() {
  return (
    <ParticipantPage
      title="Citizens"
      type="citizen"
      fields={[
        { name: 'citizenId',   label: 'Citizen ID',    placeholder: 'e.g. CIT001' },
        { name: 'name',        label: 'Name',           placeholder: 'e.g. John Doe' },
        { name: 'dateOfBirth', label: 'Date of Birth',  type: 'date' },
      ]}
    />
  );
}
