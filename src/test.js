const express = require("express");
console.log("path hitted");
const app = express();

app.use((req, res) => {
  res.send("ds;ijaff[aahojodfh");
});
app.listen(4000, () => {
  console.log("server has started");
});
console.log(ad);
