export default async function handler(req, res) {

  try {

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyhZ3kmNwltzCzufoSWllj4sCtAcBBoddr74H_6oMZYIBptnGRhYJsaAZBitPS_6lmzPQ/exec?mode=api"
    );

    const data = await response.text();

    res.status(200).send(data);

  } catch (err) {

    res.status(500).json({
      error: err.toString()
    });

  }

}
