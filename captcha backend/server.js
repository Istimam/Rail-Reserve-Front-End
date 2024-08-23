const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/upload', (req, res) => {
    const params = req.params
    console.log(params);
    // Handle the form data here
    res.json({ captchaSuccess: true });
});
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
