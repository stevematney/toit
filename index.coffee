ToitController = require("./app/js/toit_controller.js")
app = new ToitController(__dirname, Number(process.env.PORT))
app.start()

console.log("starting on 3001")
