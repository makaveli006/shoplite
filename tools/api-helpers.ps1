# Helper functions for testing the ShopLite API from Windows PowerShell.
# Load them into your current PowerShell window with (note the dot and space at the start):
#     . .\tools\api-helpers.ps1

$api = 'http://127.0.0.1:8000/api'

# Send a request and print "<status code> <response body>", also for errors (4xx/5xx).
# Example: Send-Json POST "$api/cart/items/" @{ product_id = 7; quantity = 2 } -Headers $bob
function Send-Json {
    param([string]$Method, [string]$Url, $Body = $null, [hashtable]$Headers = @{})
    $json = if ($null -ne $Body) { $Body | ConvertTo-Json -Depth 5 } else { $null }
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Method $Method -Uri $Url -Headers $Headers -ContentType 'application/json' -Body $json
        "$($response.StatusCode) $($response.Content)"
    } catch {
        "$([int]$_.Exception.Response.StatusCode) $($_.ErrorDetails.Message)"
    }
}

# Log in and return a ready-to-use Authorization header.
# Example: $bob = Get-AuthHeader 'bob@example.com' 'Sunny-Garden-42'
function Get-AuthHeader {
    param([string]$Email, [string]$Password)
    $body = @{ email = $Email; password = $Password } | ConvertTo-Json
    $tokens = Invoke-RestMethod -Method Post -Uri "$api/auth/token/" -ContentType 'application/json' -Body $body
    @{ Authorization = "Bearer $($tokens.access)" }
}

Write-Host "Loaded: `$api, Send-Json, Get-AuthHeader"
