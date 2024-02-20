const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();

app.use(express.json({ extended: false }));
app.use(cors());

app.get("/", async (req, res) => {
  let file_url = req.query.url;
  let file_name = req.query.name;
  let mime_type = req.query.mime_type;

  if (!file_url || !file_name || !mime_type) {
    return res
      .status(200)
      .json({ success: false, data: [], error: "Empty file params" });
  }
  
  try {
    const response = await fetch(decodeURIComponent(file_url));

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    res.setHeader("Content-Disposition", `attachment; filename=${file_name}`);
    res.setHeader("Content-Type", mime_type);
    response.body.pipe(res);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error downloading file");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
