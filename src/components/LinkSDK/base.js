module.exports = function(version) { return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />  
            <script src="https://cdn.leantech.me/link/sdk/web/${version ? `${version}` : "latest"}/Lean.min.js"></script>
        </head>
        <body>
            <div id=lean-link />
        </body>
    </html>
`};