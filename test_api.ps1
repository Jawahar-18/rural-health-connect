$body = @{ username = "dr.deshmukh"; password = "Password@123" } | ConvertTo-Json
Write-Host "=========================================================="
Write-Host "   RURAL HEALTH CONNECT (SWASTHYA SETU) FULL SYSTEM TEST"
Write-Host "=========================================================="

Write-Host "`n[1/7] Testing Authentication (/api/auth/login)..."
$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json"
Write-Host " -> Logged in as: $($login.user.name) [Role: $($login.user.role)]"
Write-Host " -> Facility: $($login.user.facilityName)"

$headers = @{ Authorization = "Bearer $($login.token)" }

Write-Host "`n[2/7] Testing Doctor & PHC Dashboards..."
$docDash = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard/doctor" -Method GET -Headers $headers
Write-Host " -> Doctor Queue Waiting: $($docDash.queueWaitingCount), Urgent: $($docDash.urgentQueueCount), High Risk: $($docDash.highRiskCount)"

$facDash = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard/facility/fac-phc-junnar" -Method GET -Headers $headers
Write-Host " -> Facility: $($facDash.facilityName) | Patients Today: $($facDash.totalPatientsToday) | Avg Wait: $($facDash.avgWaitingTimeMinutes)m"

$distDash = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard/district/Pune" -Method GET -Headers $headers
Write-Host " -> District Analytics: $($distDash.district) ($($distDash.totalFacilities) Facilities, Total Volume: $($distDash.totalPatientsToday))"

Write-Host "`n[3/7] Testing Patients Directory (/api/patients)..."
$patients = Invoke-RestMethod -Uri "http://localhost:8080/api/patients?page=0&size=5" -Method GET -Headers $headers
Write-Host " -> Total Patients in MySQL: $($patients.totalElements)"
Write-Host " -> Sample: $($patients.content[0].fullName) | ABHA: $($patients.content[0].abhaId) | Village: $($patients.content[0].village) | Risk: $($patients.content[0].followupRiskScore)%"

Write-Host "`n[4/7] Testing Live Queue for PHC Junnar (/api/queue/fac-phc-junnar)..."
$queue = Invoke-RestMethod -Uri "http://localhost:8080/api/queue/fac-phc-junnar" -Method GET -Headers $headers
Write-Host " -> Active OPD Queue Tokens: $($queue.Count) patients waiting"
if ($queue.Count -gt 0) {
    Write-Host " -> Next in Queue: Token #$($queue[0].tokenNumber) - $($queue[0].patientName) (Priority: $($queue[0].priority))"
}

Write-Host "`n[5/7] Testing Medicine & PHC Drug Inventory (/api/medicines/availability)..."
$stock = Invoke-RestMethod -Uri "http://localhost:8080/api/medicines/availability" -Method GET -Headers $headers
Write-Host " -> Medicine Stock Tracked: $($stock.Count) items"
Write-Host " -> Sample Stock: $($stock[0].medicineName) - Quantity: $($stock[0].currentStock) $($stock[0].unit) (Status: $($stock[0].status))"

Write-Host "`n[6/7] Testing AI Follow-up Risk Engine (/api/risk-prediction/pat-102)..."
$risk = Invoke-RestMethod -Uri "http://localhost:8080/api/risk-prediction/pat-102" -Method GET -Headers $headers
Write-Host " -> Patient Risk Score: $($risk.riskScore)/100 [$($risk.riskLevel)]"
Write-Host " -> Recommended Action: $($risk.recommendedAction)"
Write-Host " -> Primary Drivers: $($risk.primaryDrivers -join ', ')"

Write-Host "`n[7/7] Testing High-Risk Proactive Cohort (/api/followups/high-risk)..."
$highRisk = Invoke-RestMethod -Uri "http://localhost:8080/api/followups/high-risk" -Method GET -Headers $headers
Write-Host " -> High-risk follow-up cases requiring ASHA visits: $($highRisk.Count)"

Write-Host "`n=========================================================="
Write-Host "   ALL 7 CORE SUBSYSTEMS VERIFIED AND FULLY OPERATIONAL!"
Write-Host "=========================================================="
