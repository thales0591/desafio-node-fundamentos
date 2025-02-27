import { parse } from 'csv-parse'

export async function json (req, res) {
  const buffers = []

  for await (const chunk of req)
  {
    buffers.push(chunk)
  }

  let rawData = Buffer.concat(buffers).toString()

  try 
  {
    req.body = JSON.parse(rawData)
  }
  catch
  {
    try {
      req.body = await new Promise((resolve, reject) => {
        parse(rawData, { columns: true, trim: true }, (err, records) => {
          if (err) {
            reject(err);
          } else {
            resolve(records);
          }
        });
      });
     } catch {
      req.body = null;
    } 
  }
}