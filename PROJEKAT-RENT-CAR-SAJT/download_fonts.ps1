$fonts = @(
    @{
        name = "Poppins-Regular"
        url = "https://fonts.gstatic.com/s/poppins/v22/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2"
    },
    @{
        name = "Poppins-Medium"
        url = "https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLGT9Z1xlFd2JQEk.woff2"
    },
    @{
        name = "Poppins-SemiBold"
        url = "https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2"
    },
    @{
        name = "Poppins-Bold"
        url = "https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2"
    }
)

foreach ($font in $fonts) {
    $outputPath = "fonts/$($font.name).woff2"
    Invoke-WebRequest -Uri $font.url -OutFile $outputPath
    Write-Host "Downloaded $($font.name)"
}
