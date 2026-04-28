import ParticipantPage from './ParticipantPage';

export default function GovernmentPage() {
  return (
    <ParticipantPage
      title="Government Participants"
      type="government"
      fields={[
        { name: 'govId',  label: 'Government ID', placeholder: 'e.g. GOV001' },
        { name: 'name',   label: 'Name',           placeholder: 'e.g. Health Ministry' },
      ]}
    />
  );
}
