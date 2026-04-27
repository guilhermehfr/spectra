async function getPatients() {
  const res = await fetch("http://127.0.0.1:8000/api/patients/", {
    cache: "no-store"
  });

  return res.json();
}

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <main>
      <h1>Pacientes</h1>

      {patients.map((patient: { id: number; name: string; guardian_name: string }) => (
        <div key={patient.id}>
          <h2>{patient.name}</h2>
          <p>Responsável: {patient.guardian_name}</p>
        </div>
      ))}
    </main>
  );
}