$body = @{
    userName = "testuser999"
    name = "Test User"
    email = "test999@example.com"
    password = "password"
    role = "FREELANCER"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8082/auth/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success: $response"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())"
    }
}
