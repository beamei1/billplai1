export default async function handler(req, res) {

  try {

    const GAS_URL =
      "https://script.google.com/macros/s/AKfycbyhZ3kmNwltzCzufoSWllj4sCtAcBBoddr74H_6oMZYIBptnGRhYJsaAZBitPS_6lmzPQ/exec?mode=api";

    const response = await fetch(GAS_URL);

    const data = await response.text();

    res.setHeader("Content-Type", "application/json");

    return res.status(200).send(data);

  } catch (err) {

    return res.status(500).json({
      error: err.toString()
    });

  }

}
