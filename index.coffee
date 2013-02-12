ToitController = require("./app/js/toit_controller.js")
app = new ToitController(__dirname, process.env.PORT)
app.start()

console.log("starting on 3001")
