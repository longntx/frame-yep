export default function handler(req, res) {
  if (req.method === 'POST' && req?.body.data) {
    // Process a POST request
    res.setHeader(
      'content-disposition',
      `attachment; filename=${req?.body.name}`,
    );
    res.setHeader('content-type', 'image/png');
    const base64content = req.body.data.replace(/^data:image\/png;base64,/, '');
    res.status(200).send(base64content);
  } else {
    // Handle any other HTTP method
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set desired value here
    },
  },
};
