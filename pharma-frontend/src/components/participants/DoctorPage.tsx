import ParticipantPage from './ParticipantPage';

export default function DoctorPage() {
  return (
    <ParticipantPage
      title="Doctors"
      type="doctor"
      fields={[
        { name: 'doctorId',       label: 'Doctor ID',       placeholder: 'e.g. DOC001' },
        { name: 'name',           label: 'Name',             placeholder: 'e.g. Dr. Sarah Johnson' },
        { name: 'licenseNumber',  label: 'License Number',   placeholder: 'e.g. LIC12345' },
        { name: 'specialization', label: 'Specialization',   placeholder: 'e.g. General Practitioner' },
      ]}
    />
  );
}
