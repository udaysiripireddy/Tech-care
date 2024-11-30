let diagnosisChart;
const fetchData = async () => {
    const url = "https://fedskillstest.coalitiontechnologies.workers.dev";
    const username = "coalition";
    const password = "skills-test";
    const authHeader = "Basic " + btoa(`${username}:${password}`);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: authHeader,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return [];
    }
};


const renderPatients = (patients) => {
    const patientList = document.getElementById("patient-list");
    patientList.innerHTML = "";

    patients.forEach((patient, index) => {
        const li = document.createElement("li");
        li.classList.add("patient-item");
        if (index === 0) li.classList.add("selected");
        li.textContent = patient.name;

        li.addEventListener("click", () => {
            document.querySelectorAll(".patient-item").forEach((item) => item.classList.remove("selected"));
            li.classList.add("selected");
            renderPatientDetails(patient);
        });

        patientList.appendChild(li);
    });

    if (patients.length > 0) renderPatientDetails(patients[0]);
};


const renderPatientDetails = (patient) => {
    document.getElementById("profile-name").textContent = patient.name;
    document.getElementById("profile-picture").src = patient.profile_picture;
    document.getElementById("dob").textContent = patient.date_of_birth;
    document.getElementById("gender").textContent = patient.gender;
    document.getElementById("contact").textContent = patient.phone_number;
    document.getElementById("emergency-contact").textContent = patient.emergency_contact;


    const diagnosis = patient.diagnosis_history[0];
    document.getElementById("bpStats").textContent = `Systolic: ${diagnosis.blood_pressure.systolic.value}, Diastolic: ${diagnosis.blood_pressure.diastolic.value}`;
    document.getElementById("respiratory-rate").textContent = `${diagnosis.respiratory_rate.value} bpm (${diagnosis.respiratory_rate.levels})`;
    document.getElementById("temperature").textContent = `${diagnosis.temperature.value}°F (${diagnosis.temperature.levels})`;
    document.getElementById("heart-rate").textContent = `${diagnosis.heart_rate.value} bpm (${diagnosis.heart_rate.levels})`;

    renderDiagnosisChart(patient.diagnosis_history);
};


const renderDiagnosisChart = (diagnosisHistory) => {
    const ctx = document.getElementById("diagnosis-chart").getContext("2d");

    const labels = diagnosisHistory.map((entry) => `${entry.month} ${entry.year}`);
    const systolicData = diagnosisHistory.map((entry) => entry.blood_pressure.systolic.value);
    const diastolicData = diagnosisHistory.map((entry) => entry.blood_pressure.diastolic.value);
    const heartRateData = diagnosisHistory.map((entry) => entry.heart_rate.value);

    if (diagnosisChart) {
        diagnosisChart.destroy();
    }


    diagnosisChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Systolic Pressure",
                    data: systolicData,
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    fill: true,
                },
                {
                    label: "Diastolic Pressure",
                    data: diastolicData,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    fill: true,
                },
                {
                    label: "Heart Rate",
                    data: heartRateData,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
};


fetchData().then((data) => {
    if (data.length > 0) {
        renderPatients(data);
    } else {
        console.error("No patient data available to display.");
    }
});

document.querySelectorAll('.dots').forEach(button => {
    button.addEventListener('click', () => {

        alert('More options for this patient');
    });
});
